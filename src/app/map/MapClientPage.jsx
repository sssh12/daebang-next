"use client";
import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import PropertyDetail from "@/components/PropertyDetail";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function MapClientPage({ center, properties }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(3);
  const [visibleIds, setVisibleIds] = useState([]);
  const [filterValues, setFilterValues] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState(new Set());

  const visibleProperties = useMemo(
    () => properties.filter((p) => visibleIds.includes(p.id)),
    [properties, visibleIds]
  );

  return (
    <div className="flex h-[calc(100vh-64px)] mt-16">
      <aside className="w-md h-full bg-white shadow-lg z-10">
        {selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        ) : (
          <Sidebar
            properties={visibleProperties}
            onSelect={setSelectedProperty}
            selectedProperty={selectedProperty}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            highlightedIds={highlightedIds}
            setHighlightedIds={setHighlightedIds}
          />
        )}
      </aside>
      <div className="flex-1 h-full relative">
        <Map
          center={mapCenter}
          zoom={mapZoom}
          properties={properties}
          selectedProperty={selectedProperty}
          onMarkerClick={setSelectedProperty}
          onMapChange={({ center, zoom }) => {
            setMapCenter(center);
            setMapZoom(zoom);
          }}
          onVisiblePropertiesChange={setVisibleIds}
          highlightedIds={highlightedIds}
        />
      </div>
    </div>
  );
}
