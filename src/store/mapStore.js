import { create } from "zustand";

export const useMapStore = create((set) => ({
  properties: [],
  selectedProperty: null,
  isLoading: true,
  filterValues: null,
  highlightedIds: new Set(),
  selectedSchool: null,
  mapBounds: null,
  mapInstance: null,
  currentZoom: 3,
  minZoom: 2,
  maxZoom: 5,
  isFilterPanelOpen: false,

  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setFilterValues: (values) => set({ filterValues: values }),
  setHighlightedIds: (ids) => set({ highlightedIds: ids }),
  setSelectedSchool: (school) => set({ selectedSchool: school }),
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
  setMapInstance: (map) => set({ mapInstance: map }),
  setCurrentZoom: (zoom) => set({ currentZoom: zoom }),
  setZoomLimits: ({ min, max }) => set({ minZoom: min, maxZoom: max }),

  setFilterPanelOpen: (isOpen) => set({ isFilterPanelOpen: isOpen }),

  fetchProperties: async (bounds) => {
    if (!bounds) return;
    set({ isLoading: true });

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
        console.error(
          "Failed to fetch properties:",
          response.status,
          response.statusText
        );
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }
      const data = await response.json();
      set({ properties: data });
    } catch (error) {
      console.error("Error in fetchProperties:", error);
      set({ properties: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
