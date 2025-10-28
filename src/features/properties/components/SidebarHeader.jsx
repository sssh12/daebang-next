"use client";

import { RotateCcw, ListFilterPlus, X } from "lucide-react";

export default function SidebarHeader({
  hasActiveFilters,
  onFilterButton,
  onResetFilter,
  headerRef,
  filterOpen,
}) {
  return (
    <>
      <div
        ref={headerRef}
        className="p-4 flex justify-between items-center space-x-2 flex-shrink-0"
      >
        <input
          className="w-full border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          placeholder="검색어 입력(구현 예정)"
          // TODO: 검색 기능 구현 시 필요한 상태 및 핸들러 연결
        />
        <button
          className="w-1/4 h-full bg-green-600 hover:bg-green-900 text-white px-2 py-1 rounded font-semibold transition cursor-pointer active:scale-98"
          onClick={onFilterButton}
        >
          <div className="flex justify-between items-center">
            <span className="mx-0.5">{filterOpen ? "닫기" : "필터"}</span>
            {filterOpen ? (
              <X className="w-4 h-4 mr-1" />
            ) : (
              <ListFilterPlus className="w-4 h-4 mr-1" />
            )}
          </div>
        </button>

        {hasActiveFilters && (
          <button
            className="px-2 py-1 h-full border border-gray-300 rounded text-gray-500 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
            onClick={onResetFilter}
            title="필터 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
}
