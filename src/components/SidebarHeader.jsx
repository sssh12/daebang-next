"use client";

import { RotateCcw } from "lucide-react";

export default function SidebarHeader({
  filterValues,
  onFilterButton,
  onResetFilter,
  headerRef,
  filterOpen,
}) {
  return (
    <div
      ref={headerRef}
      className="p-6 flex justify-between items-center space-x-2 flex-shrink-0"
    >
      <input
        className="w-full border border-gray-400 rounded px-2 py-1"
        placeholder="검색어 입력(구현 예정)"
      />
      <button
        className="w-1/4 h-full bg-main hover:bg-accent text-white px-2 py-1 rounded font-semibold transition cursor-pointer active:scale-98"
        onClick={onFilterButton}
      >
        {filterOpen ? "닫기" : "필터"}
      </button>
      {filterValues && (
        <button
          className="px-2 py-1 h-full border border-gray-300 rounded text-gray-500 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
          onClick={onResetFilter}
          title="필터 초기화"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
