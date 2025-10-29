"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { getPixelClusters } from "@/features/map/utils/getPixelClusters";
import {
  createMarkerOverlay,
  createClusterOverlay,
  createSchoolOverlay,
} from "@/features/map/utils/createOverlay";
import { useMapStore } from "@/store/mapStore";

const SCHOOL_MARKER_MAX_LEVEL = 4;

export default function Map({ center, zoom }) {
  const mapRef = useRef(null);
  const overlaysRef = useRef([]);
  const schoolOverlayRef = useRef(null);
  const mapInstance = useRef(null);

  const {
    properties,
    selectedProperty,
    highlightedIds,
    selectedSchool,
    setSelectedProperty,
    setMapBounds,
    setMapInstance,
    setCurrentZoom,
    setZoomLimits,
    setFilterPanelOpen,
    isCalculatingHighlights,
  } = useMapStore();

  const [hoveredId, setHoveredId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const drawOverlays = useCallback(() => {
    if (!mapInstance.current || !window.kakao?.maps) return;
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];
    const clusters = getPixelClusters(properties, mapInstance.current, 44);
    clusters.forEach((group) => {
      if (group.length === 1) {
        const property = group[0];
        const isHighlighted =
          !isCalculatingHighlights && highlightedIds.has(property.id);
        const div = createMarkerOverlay({
          isHighlighted,
          onHover: () => setHoveredId(property.id),
          onLeave: () => setHoveredId(null),
          onClick: () => {
            setActiveId(property.id);
            setSelectedProperty(property);
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
        const hasRecommended =
          !isCalculatingHighlights &&
          group.some((item) => highlightedIds.has(item.id));
        const div = createClusterOverlay({
          hasRecommended,
          count: group.length,
          onClick: () => {
            const currentLevel = mapInstance.current.getLevel();
            if (currentLevel <= 2) return;
            mapInstance.current.setLevel(Math.max(currentLevel - 2, 2));
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
    highlightedIds,
    setSelectedProperty,
    isCalculatingHighlights,
  ]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=clusterer,services`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapOptions = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: zoom,
          minLevel: 1,
          maxLevel: 5,
        };
        const map = new window.kakao.maps.Map(mapRef.current, mapOptions);
        mapInstance.current = map;
        setMapInstance(map);
        setCurrentZoom(map.getLevel());
        setZoomLimits({ min: mapOptions.minLevel, max: mapOptions.maxLevel });
        let debounceTimeout;
        window.kakao.maps.event.addListener(map, "idle", () => {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            setMapBounds(map.getBounds());
          }, 100);
        });
        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
          setCurrentZoom(map.getLevel());
          if (schoolOverlayRef.current) {
            const currentLevel = map.getLevel();
            schoolOverlayRef.current.setMap(
              currentLevel <= SCHOOL_MARKER_MAX_LEVEL ? map : null
            );
          }
          drawOverlays();
        });
        window.kakao.maps.event.addListener(map, "click", () => {
          if (useMapStore.getState().isFilterPanelOpen) {
            setFilterPanelOpen(false);
          }
        });
        window.kakao.maps.event.addListener(map, "dragstart", () => {
          if (useMapStore.getState().isFilterPanelOpen) {
            setFilterPanelOpen(false);
          }
        });
        setMapBounds(map.getBounds());
      });
    };
    return () => {
      const scripts = document.head.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes("dapi.kakao.com")) {
          try {
            document.head.removeChild(scripts[i]);
          } catch (e) {}
          break;
        }
      }
      mapInstance.current = null;
      setMapInstance(null);
    };
  }, []);

  useEffect(() => {
    drawOverlays();
  }, [properties, highlightedIds, isCalculatingHighlights, drawOverlays]);

  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps) return;
    if (schoolOverlayRef.current) {
      schoolOverlayRef.current.setMap(null);
      schoolOverlayRef.current = null;
    }
    if (selectedSchool?.building_lat && selectedSchool?.building_lng) {
      const div = createSchoolOverlay();
      const position = new window.kakao.maps.LatLng(
        Number(selectedSchool.building_lat),
        Number(selectedSchool.building_lng)
      );
      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: div,
        yAnchor: 1,
      });
      const currentLevel = mapInstance.current.getLevel();
      if (currentLevel <= SCHOOL_MARKER_MAX_LEVEL) {
        overlay.setMap(mapInstance.current);
      }
      schoolOverlayRef.current = overlay;

      mapInstance.current.setCenter(position);
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedProperty && mapInstance.current?.setCenter) {
      if (
        selectedProperty.lat &&
        selectedProperty.lng &&
        !isNaN(Number(selectedProperty.lat)) &&
        !isNaN(Number(selectedProperty.lng))
      ) {
        const moveLatLng = new window.kakao.maps.LatLng(
          Number(selectedProperty.lat),
          Number(selectedProperty.lng)
        );
        mapInstance.current.setCenter(moveLatLng);
      }
    }
  }, [selectedProperty]);

  return <div ref={mapRef} className="w-full h-full" />;
}
