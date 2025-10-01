"use client";
import PropertyListItem from "./PropertyListItem";

export default function PropertyList({
  properties,
  highlightedIds,
  selectedProperty,
  onSelect,
}) {
  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        매물을 찾을 수 없습니다.
      </div>
    );
  }
  return (
    <ul className="space-y-4 flex-1 min-h-0 overflow-y-auto">
      {properties.map((p) => (
        <PropertyListItem
          key={p.id}
          property={p}
          highlighted={highlightedIds.has(p.id)}
          selected={selectedProperty?.id === p.id}
          onClick={() => onSelect?.(p)}
        />
      ))}
    </ul>
  );
}
