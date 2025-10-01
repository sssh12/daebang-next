"use client";
import { useEffect, useRef, useState } from "react";
import { getPixelClusters } from "@/utils/getPixelClusters";
import {
  createMarkerOverlay,
  createClusterOverlay,
} from "@/utils/createOverlay";

export default function Map({
  center,
  zoom,
  properties,
  selectedProperty,
  onMarkerClick,
  onMapChange,
  onVisiblePropertiesChange,
  highlightedIds = new Set(),
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlaysRef = useRef([]);
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

        if (onVisiblePropertiesChange) {
          const bounds = map.getBounds();
          const visibleIds = properties
            .filter((p) => {
              const latlng = new window.kakao.maps.LatLng(
                Number(p.lat),
                Number(p.lng)
              );
              return bounds.contain(latlng);
            })
            .map((p) => p.id);
          onVisiblePropertiesChange(visibleIds);
        }

        window.kakao.maps.event.addListener(map, "idle", () => {
          const bounds = map.getBounds();
          const visibleIds = properties
            .filter((p) => {
              const latlng = new window.kakao.maps.LatLng(
                Number(p.lat),
                Number(p.lng)
              );
              return bounds.contain(latlng);
            })
            .map((p) => p.id);
          if (onVisiblePropertiesChange) onVisiblePropertiesChange(visibleIds);
          if (onMapChange)
            onMapChange({
              center: {
                lat: map.getCenter().getLat(),
                lng: map.getCenter().getLng(),
              },
              zoom: map.getLevel(),
            });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps) return;

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    const clusters = getPixelClusters(properties, mapInstance.current, 44);

    clusters.forEach((group) => {
      if (group.length === 1) {
        const property = group[0];
        const isHighlighted = highlightedIds.has(property.id);
        const isHovered = hoveredId === property.id;
        const isActive = activeId === property.id;

        const div = createMarkerOverlay({
          property,
          isHighlighted,
          isHovered,
          isActive,
          onHover: () => setHoveredId(property.id),
          onLeave: () => setHoveredId(null),
          onClick: () => {
            setActiveId(property.id);
            if (onMarkerClick) onMarkerClick(property);
            setTimeout(() => setActiveId(null), 300);
          },
        });

        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(
            Number(property.lat),
            Number(property.lng)
          ),
          content: div,
          yAnchor: 1,
        });

        overlay.setMap(mapInstance.current);
        overlaysRef.current.push(overlay);
      } else {
        const centerLat =
          group.reduce((acc, cur) => acc + Number(cur.lat), 0) / group.length;
        const centerLng =
          group.reduce((acc, cur) => acc + Number(cur.lng), 0) / group.length;
        const hasRecommended = group.some((item) =>
          highlightedIds.has(item.id)
        );

        const div = createClusterOverlay({
          centerLat,
          centerLng,
          hasRecommended,
          count: group.length,
          onClick: () => {
            const currentLevel = mapInstance.current.getLevel();
            if (currentLevel <= 3) return;
            mapInstance.current.setLevel(Math.max(currentLevel - 2, 3));
            mapInstance.current.setCenter(
              new window.kakao.maps.LatLng(centerLat, centerLng)
            );
          },
        });

        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(centerLat, centerLng),
          content: div,
          yAnchor: 1,
        });

        overlay.setMap(mapInstance.current);
        overlaysRef.current.push(overlay);
      }
    });
  }, [
    properties,
    onMarkerClick,
    mapInstance.current,
    highlightedIds,
    hoveredId,
    activeId,
  ]);

  useEffect(() => {
    if (
      selectedProperty &&
      mapInstance.current &&
      typeof mapInstance.current.setCenter === "function"
    ) {
      const moveLatLng = new window.kakao.maps.LatLng(
        selectedProperty.lat,
        selectedProperty.lng
      );
      mapInstance.current.setCenter(moveLatLng);
    }
  }, [selectedProperty]);

  return <div ref={mapRef} className="w-full h-full" />;
}
