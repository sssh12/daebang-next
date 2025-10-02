"use client";
import { useState, useMemo, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import PropertyList from "./PropertyList";
import { getDistance } from "@/utils/getDistance";
import { createClient } from "@/utils/supabase/client";
import { filterComparators, isActiveFilter } from "@/utils/filterUtils";

export default function Sidebar({
  properties,
  onSelect,
  selectedProperty,
  filterValues,
  setFilterValues,
  setHighlightedIds,
}) {
  const [departmentBuildings, setDepartmentBuildings] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchBuildings() {
      if (filterValues?.department && !isNaN(Number(filterValues.department))) {
        const { data, error } = await supabase
          .from("department")
          .select("id, name, building_lat, building_lng")
          .eq("id", Number(filterValues.department));
        if (!error && data && data.length > 0) setDepartmentBuildings(data);
        else setDepartmentBuildings([]);
      } else setDepartmentBuildings([]);
    }
    fetchBuildings();
  }, [filterValues?.department]);

  const highlightedIds = useMemo(() => {
    if (!filterValues) return new Set();

    const activeFilters = Object.entries(filterValues).filter(([key, value]) =>
      isActiveFilter(key, value)
    );

    return new Set(
      properties
        .filter((p) => {
          if (filterValues.department && departmentBuildings.length > 0) {
            const DIST_LIMIT = 400;
            const building = departmentBuildings[0];
            if (!p.lat || !p.lng) return false;
            const dist = getDistance(
              Number(building.building_lat),
              Number(building.building_lng),
              p.lat,
              p.lng
            );
            if (dist > DIST_LIMIT) return false;
          }
          return activeFilters.every(([key, value]) => {
            if (key === "department") return true;
            return filterComparators[key]
              ? filterComparators[key](p, value)
              : true;
          });
        })
        .map((p) => p.id)
    );
  }, [properties, filterValues, departmentBuildings]);

  useEffect(() => {
    if (setHighlightedIds) setHighlightedIds(highlightedIds);
  }, [highlightedIds, setHighlightedIds]);

  const sortedProperties = useMemo(() => {
    if (!filterValues || highlightedIds.size === 0) return properties;
    const recommended = [];
    const others = [];
    for (const p of properties) {
      if (highlightedIds.has(p.id)) recommended.push(p);
      else others.push(p);
    }
    return [...recommended, ...others];
  }, [properties, highlightedIds, filterValues]);

  return (
    <aside className="flex flex-col h-full relative">
      <SidebarHeader
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <PropertyList
        properties={sortedProperties}
        highlightedIds={highlightedIds}
        selectedProperty={selectedProperty}
        onSelect={onSelect}
      />
    </aside>
  );
}
