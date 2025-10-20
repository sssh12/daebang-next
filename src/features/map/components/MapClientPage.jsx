"use client";
import { useEffect } from "react";
import Sidebar from "@/features/properties/components/Sidebar";
import PropertyDetail from "@/features/properties/components/PropertyDetail";
import dynamic from "next/dynamic";
import { useMapStore } from "@/store/mapStore";
import { Plus, Minus } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Map = dynamic(() => import("@/features/map/components/Map"), {
  ssr: false,
});

export default function MapClientPage({ center }) {
  const {
    selectedProperty,
    setSelectedProperty,
    mapBounds,
    fetchProperties,
    mapInstance,
    isLoading,
    currentZoom,
    minZoom,
    maxZoom,
  } = useMapStore();

  useEffect(() => {
    if (mapBounds) {
      fetchProperties(mapBounds);
    }
  }, [mapBounds, fetchProperties]);

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.setLevel(mapInstance.getLevel() - 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.setLevel(mapInstance.getLevel() + 1);
    }
  };

  const isZoomInDisabled = currentZoom <= minZoom;
  const isZoomOutDisabled = currentZoom >= maxZoom;

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <aside className="w-md h-full bg-white shadow-lg z-20">
        {selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        ) : (
          <Sidebar />
        )}
      </aside>
      <div className="flex-1 h-full relative z-20">
        <Map center={center} zoom={3} />
        {isLoading && <LoadingSpinner />}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            disabled={isZoomInDisabled}
            className={`w-10 h-10 bg-white rounded-md shadow-lg flex items-center justify-center transition border-2 border-gray-300 ${
              isZoomInDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer active:scale-95"
            }`}
            aria-label="지도 확대"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={isZoomOutDisabled}
            className={`w-10 h-10 bg-white rounded-md shadow-lg flex items-center justify-center transition   border-2 border-gray-300 ${
              isZoomOutDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer active:scale-95"
            }`}
            aria-label="지도 축소"
          >
            <Minus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
