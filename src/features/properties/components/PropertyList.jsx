"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import PropertyListItem from "./PropertyListItem";
import { MapPinOff } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import PropertyListItemSkeleton from "./PropertyListItemSkeleton";

const ITEMS_PER_PAGE = 12;

export default function PropertyList({ properties, highlightedIds }) {
  const { selectedProperty, setSelectedProperty, isLoading } = useMapStore();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [properties]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && properties.length > visibleCount) {
        setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
      }
    },
    [visibleCount, properties.length]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (isLoading && properties.length === 0) {
    return (
      <ul className="space-y-4 flex-1 min-h-0 overflow-y-auto p-2">
        {[...Array(5)].map((_, i) => (
          <PropertyListItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  if (isLoading && properties.length === 0) {
    return (
      <ul className="space-y-4 flex-1 min-h-0 overflow-y-auto p-2">
        {[...Array(5)].map((_, i) => (
          <PropertyListItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  if (!isLoading && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-4">
        <MapPinOff className="w-16 h-16 mb-4 text-gray-300" />
        <p className="font-semibold">주변에 매물이 없습니다.</p>
        <p className="text-sm">지도를 이동하거나 필터 조건을 변경해보세요.</p>
      </div>
    );
  }

  const visibleProperties = properties.slice(0, visibleCount);

  return (
    <>
      <p className="text-sm text-orange-500 font-bold mx-5 mb-1">
        현재 표시되는 매물들은 예시로 임시 저장된 매물입니다.
      </p>
      <ul className="space-y-4 flex-1 min-h-0 overflow-y-auto p-2">
        {visibleProperties.map((p) => (
          <PropertyListItem
            key={p.id}
            property={p}
            highlighted={highlightedIds.has(p.id)}
            selected={selectedProperty?.id === p.id}
            onClick={() => setSelectedProperty(p)}
          />
        ))}
        {properties.length > visibleCount && (
          <div ref={loadMoreRef} style={{ height: "50px", margin: "10px 0" }}>
            <p className="text-center text-gray-500">
              더 많은 매물 불러오는 중...
            </p>
          </div>
        )}
      </ul>
    </>
  );
}
