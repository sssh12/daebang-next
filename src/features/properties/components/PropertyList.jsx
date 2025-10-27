"use client";
import PropertyListItem from "./PropertyListItem";
import { MapPinOff } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import PropertyListItemSkeleton from "./PropertyListItemSkeleton";

export default function PropertyList({ properties, highlightedIds }) {
  const { selectedProperty, setSelectedProperty, isLoading } = useMapStore();

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

  return (
    <>
      <p className="text-sm text-orange-500 font-bold mx-5 mb-1">
        현재 표시되는 매물들은 예시로 임시 저장된 매물입니다.
      </p>
      <ul className="space-y-4 flex-1 min-h-0 overflow-y-auto p-2">
        {properties.map((p) => (
          <PropertyListItem
            key={p.id}
            property={p}
            highlighted={highlightedIds.has(p.id)}
            selected={selectedProperty?.id === p.id}
            onClick={() => setSelectedProperty(p)}
          />
        ))}
      </ul>
    </>
  );
}
