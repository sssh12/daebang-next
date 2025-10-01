"use client";
import { useState } from "react";
import FilterPanel from "./FilterPanel";

export default function SidebarHeader({ filterValues, setFilterValues }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const handleFilterButton = () => {
    if (!filterOpen) {
      setFilterOpen(true);
      setTimeout(() => setFilterVisible(true), 10);
    } else {
      setFilterVisible(false);
      setTimeout(() => setFilterOpen(false), 200);
    }
  };

  const handleResetFilter = () => setFilterValues(null);

  return (
    <div className="p-6 flex justify-between items-center space-x-2 flex-shrink-0">
      <input
        className="w-full border rounded px-2 py-1"
        placeholder="검색어 입력"
      />
      <button
        className="w-1/4 bg-main hover:bg-accent text-white px-2 py-1 rounded-lg font-semibold transition cursor-pointer active:scale-98"
        onClick={handleFilterButton}
      >
        {filterOpen ? "닫기" : "필터"}
      </button>
      {filterOpen && (
        <FilterPanel
          visible={filterVisible}
          onClose={() => {
            setFilterVisible(false);
            setTimeout(() => setFilterOpen(false), 200);
          }}
          onApply={(values) => {
            setFilterValues(values);
            setFilterVisible(false);
            setTimeout(() => setFilterOpen(false), 200);
          }}
        />
      )}
      {filterValues && (
        <button
          className="ml-2 px-2 py-1 border rounded-lg text-xs text-gray-500 hover:bg-gray-100"
          onClick={handleResetFilter}
        >
          🔙
        </button>
      )}
    </div>
  );
}
