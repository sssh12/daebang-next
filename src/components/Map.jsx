"use client";
import { useEffect, useRef, useState } from "react";
import { getPixelClusters } from "@/utils/getPixelClusters";
import {
  createMarkerOverlay,
  createClusterOverlay,
  createSchoolOverlay,
} from "@/utils/createOverlay";

export default function Map({
  center,
  zoom,
  properties,
  selectedProperty,
  onMarkerClick,
  onMapChange,
  highlightedIds = new Set(),
  schoolBuilding,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlaysRef = useRef([]);
  const schoolOverlayRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=clusterer`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: zoom,
        });
        mapInstance.current = map;

        window.kakao.maps.event.addListener(map, "idle", () => {
          const bounds = map.getBounds();
          const visibleIds = (properties || [])
            .filter((p) => {
              const latlng = new window.kakao.maps.LatLng(
                Number(p.lat),
                Number(p.lng)
              );
              return bounds.contain(latlng);
            })
            .map((p) => p.id);

          if (onMapChange) {
            onMapChange({
              center: {
                lat: map.getCenter().getLat(),
                lng: map.getCenter().getLng(),
              },
              zoom: map.getLevel(),
              bounds: bounds,
            });
          }
        });

        if (onMapChange) {
          onMapChange({
            center: {
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            },
            zoom: map.getLevel(),
            bounds: map.getBounds(),
          });
        }
      });
    };

    return () => {
      document.head.removeChild(script);
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps || !properties) {
      // properties가 아직 로드되지 않았을 경우, 기존 오버레이를 모두 지웁니다.
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
      return;
    }

    // 1. 기존 오버레이들을 부드럽게 사라지게 합니다.
    overlaysRef.current.forEach((oldOverlay) => {
      const content = oldOverlay.getContent();
      if (content) {
        content.style.opacity = "0"; // 투명도를 0으로 만들어 fade-out 시작
      }
      // 애니메이션 시간(300ms)이 지난 후 지도에서 완전히 제거합니다.
      setTimeout(() => {
        oldOverlay.setMap(null);
      }, 300);
    });

    // 2. 새로운 오버레이들을 계산하고 지도에 추가합니다.
    const clusters = getPixelClusters(properties, mapInstance.current, 44);
    const newOverlays = clusters.map((group) => {
      let div, position;
      if (group.length === 1) {
        const property = group[0];
        div = createMarkerOverlay({
          isHighlighted: highlightedIds.has(property.id),
          onClick: () => onMarkerClick?.(property),
        });
        position = new window.kakao.maps.LatLng(
          Number(property.lat),
          Number(property.lng)
        );
      } else {
        const centerLat =
          group.reduce((acc, cur) => acc + Number(cur.lat), 0) / group.length;
        const centerLng =
          group.reduce((acc, cur) => acc + Number(cur.lng), 0) / group.length;
        const hasRecommended = group.some((item) =>
          highlightedIds.has(item.id)
        );
        div = createClusterOverlay({
          hasRecommended,
          count: group.length,
          onClick: () => {
            const currentLevel = mapInstance.current.getLevel();
            if (currentLevel > 3) {
              mapInstance.current.setLevel(currentLevel - 1, {
                anchor: new window.kakao.maps.LatLng(centerLat, centerLng),
              });
            }
          },
        });
        position = new window.kakao.maps.LatLng(centerLat, centerLng);
      }

      div.style.opacity = "0"; // 처음에는 투명하게 시작

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: div,
        yAnchor: 1,
      });

      overlay.setMap(mapInstance.current); // 지도에 추가

      // 브라우저가 렌더링할 준비가 되었을 때, 투명도를 1로 바꿔 fade-in 효과를 줍니다.
      requestAnimationFrame(() => {
        div.style.opacity = "1";
      });

      return overlay;
    });

    // 3. 최신 오버레이 목록으로 교체합니다.
    overlaysRef.current = newOverlays;
  }, [properties, highlightedIds, onMarkerClick]);

  useEffect(() => {
    if (!mapInstance.current) return;
    schoolOverlayRef.current?.setMap(null);
    if (schoolBuilding?.building_lat && schoolBuilding?.building_lng) {
      const div = createSchoolOveray();
      const position = new window.kakao.maps.LatLng(
        Number(schoolBuilding.building_lat),
        Number(schoolBuilding.building_lng)
      );
      schoolOverlayRef.current = new window.kakao.maps.CustomOverlay({
        position,
        content: div,
        yAnchor: 1,
      });
      schoolOverlayRef.current.setMap(mapInstance.current);
      mapInstance.current.setCenter(position);
    }
  }, [schoolBuilding]);

  useEffect(() => {
    if (selectedProperty && mapInstance.current) {
      const moveLatLng = new window.kakao.maps.LatLng(
        selectedProperty.lat,
        selectedProperty.lng
      );
      mapInstance.current.panTo(moveLatLng);
    }
  }, [selectedProperty]);

  return <div ref={mapRef} className="w-full h-full" />;
}
