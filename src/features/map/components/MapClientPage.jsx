"use client";
import { useState, useCallback } from "react";
import Sidebar from "@/features/properties/components/Sidebar";
import PropertyDetail from "@/features/properties/components/PropertyDetail";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/features/map/components/Map"), {
  ssr: false,
});

export default function MapClientPage({ center }) {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(3);
  const [filterValues, setFilterValues] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState(new Set());
  const [selectedSchool, setSelectedSchool] = useState(null);

  const fetchProperties = useCallback(async (bounds) => {
    if (!bounds) return;

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const query = new URLSearchParams({
      sw_lat: sw.getLat(),
      sw_lng: sw.getLng(),
      ne_lat: ne.getLat(),
      ne_lng: ne.getLng(),
    }).toString();

    try {
      const response = await fetch(`/api/properties?${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <aside className="w-md h-full bg-white shadow-lg z-20">
        {selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        ) : (
          <Sidebar
            properties={properties}
            onSelect={setSelectedProperty}
            selectedProperty={selectedProperty}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            highlightedIds={highlightedIds}
            setHighlightedIds={setHighlightedIds}
            onSchoolSelect={setSelectedSchool}
          />
        )}
      </aside>
      <div className="flex-1 h-full relative z-20">
        <Map
          center={mapCenter}
          zoom={mapZoom}
          properties={properties}
          selectedProperty={selectedProperty}
          onMarkerClick={setSelectedProperty}
          onMapChange={({ center, zoom, bounds }) => {
            setMapCenter(center);
            setMapZoom(zoom);
            if (bounds) {
              fetchProperties(bounds);
            }
          }}
          highlightedIds={highlightedIds}
          schoolBuilding={selectedSchool}
        />
      </div>
    </div>
  );
}
