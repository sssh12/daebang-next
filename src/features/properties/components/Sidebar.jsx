"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import SidebarHeader from "./SidebarHeader";
import PropertyList from "./PropertyList";
import FilterPanel from "./FilterPanel";
import { getDistance } from "../utils/getDistance";
import { createClient } from "@/lib/supabase/client";
import { filterComparators, isActiveFilter } from "../utils/filterUtils";
import { useMapStore } from "@/store/mapStore";
import { getDefaultFilterValues } from "@/constants/filterConfig";

export default function Sidebar() {
  const [departmentBuildings, setDepartmentBuildings] = useState([]);
  const headerRef = useRef(null);
  const supabase = createClient();

  const {
    properties,
    filterValues,
    setFilterValues,
    setHighlightedIds,
    setSelectedSchool,
    isFilterPanelOpen,
    setFilterPanelOpen,
  } = useMapStore();

  useEffect(() => {
    async function fetchBuildings() {
      if (filterValues?.department && !isNaN(Number(filterValues.department))) {
        const { data, error } = await supabase
          .from("department")
          .select("id, name, building_lat, building_lng")
          .eq("id", Number(filterValues.department));

        if (!error && data && data.length > 0) {
          setDepartmentBuildings(data);
          setSelectedSchool(data[0]);
        } else {
          setDepartmentBuildings([]);
          setSelectedSchool(null);
          if (error)
            console.error("Error fetching department building:", error);
        }
      } else {
        setDepartmentBuildings([]);
        setSelectedSchool(null);
      }
    }
    fetchBuildings();
  }, [filterValues?.department, setSelectedSchool, supabase]);

  // highlightedIds useMemo는 변경 없음
  const highlightedIds = useMemo(() => {
    if (!filterValues) return new Set();
    let targetCoords = null;
    if (filterValues.department && departmentBuildings.length > 0) {
      const building = departmentBuildings[0];
      if (
        building.building_lat &&
        building.building_lng &&
        !isNaN(Number(building.building_lat)) &&
        !isNaN(Number(building.building_lng))
      ) {
        targetCoords = {
          lat: Number(building.building_lat),
          lng: Number(building.building_lng),
        };
      }
    }
    const activeFiltersEntries = Object.entries(filterValues).filter(
      ([key, value]) => isActiveFilter(key, value, filterValues)
    );
    const hasOtherActiveFilters = activeFiltersEntries.some(
      ([key, _]) => key !== "department"
    );
    if (
      activeFiltersEntries.length === 0 ||
      (activeFiltersEntries.length === 1 &&
        activeFiltersEntries[0][0] === "department" &&
        !hasOtherActiveFilters)
    ) {
      return new Set();
    }
    if (filterValues.department && !targetCoords && !hasOtherActiveFilters) {
      return new Set();
    }
    return new Set(
      properties
        .filter((p) => {
          return activeFiltersEntries.every(([key, value]) => {
            if (key === "department") return true;
            const comparator = filterComparators[key];
            if (!comparator) return true;
            if (key === "distanceMinutes") {
              if (!targetCoords) return true;
              return comparator(p, value, targetCoords);
            }
            if (key === "moveInDate") {
              return comparator(p, value, filterValues);
            }
            if (key === "availabilityOptions") return true;
            return comparator(p, value, filterValues);
          });
        })
        .map((p) => p.id)
    );
  }, [properties, filterValues, departmentBuildings]);

  const hasActiveFilters = useMemo(() => {
    if (!filterValues) return false;
    return Object.entries(filterValues).some(([key, value]) =>
      isActiveFilter(key, value, filterValues)
    );
  }, [filterValues]);

  useEffect(() => {
    setHighlightedIds(highlightedIds);
  }, [highlightedIds, setHighlightedIds]);

  const sortedProperties = useMemo(() => {
    if (highlightedIds.size === 0) return properties;
    const recommended = [];
    const others = [];
    const propertyMap = new Map(properties.map((p) => [p.id, p]));
    highlightedIds.forEach((id) => {
      const prop = propertyMap.get(id);
      if (prop) {
        recommended.push(prop);
        propertyMap.delete(id);
      }
    });
    others.push(...propertyMap.values());
    return [...recommended, ...others];
  }, [properties, highlightedIds]);

  const handleFilterButton = () => {
    setFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleResetFilter = () => setFilterValues(getDefaultFilterValues());

  return (
    <aside className="flex flex-col h-full relative">
      <SidebarHeader
        hasActiveFilters={hasActiveFilters}
        onFilterButton={handleFilterButton}
        onResetFilter={handleResetFilter}
        headerRef={headerRef}
        filterOpen={isFilterPanelOpen}
      />

      {isFilterPanelOpen && (
        <FilterPanel
          visible={isFilterPanelOpen}
          initialValues={filterValues || getDefaultFilterValues()}
          onClose={() => setFilterPanelOpen(false)}
          onApply={(values) => {
            setFilterValues(values);
            setFilterPanelOpen(false);
          }}
        />
      )}

      <PropertyList
        properties={sortedProperties}
        highlightedIds={highlightedIds}
      />
    </aside>
  );
}
