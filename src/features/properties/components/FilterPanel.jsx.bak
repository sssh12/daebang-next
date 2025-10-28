"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { isActiveFilter } from "../utils/filterUtils";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FILTER_CONFIG } from "@/constants/filterConfig";

export default function FilterPanel({ visible, onApply, onClose }) {
  const supabase = createClient();
  const [departments, setDepartments] = useState([]);
  const [filterState, setFilterState] = useState(
    Object.fromEntries(
      FILTER_CONFIG.map((f) => [
        f.key,
        f.default !== undefined ? f.default : "",
      ])
    )
  );

  useEffect(() => {
    const depConfig = FILTER_CONFIG.find((f) => f.fetch);
    if (depConfig) {
      supabase
        .from("department")
        .select("id, name")
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching departments:", error);
          } else {
            setDepartments(data || []);
          }
        })
        .catch((error) => {
          console.error("Unexpected error fetching departments:", error);
        });
    }
  }, [supabase]);

  const handleChange = (key, value) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (key, value) => {
    setFilterState((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const handleApply = () => {
    onApply?.(filterState);
  };

  const hasActiveFilter = Object.entries(filterState).some(([key, value]) =>
    isActiveFilter(key, value)
  );

  return (
    <div
      className={`
        absolute top-16 w-full h-[calc(100%-64px)] bg-white shadow-lg z-10
        transition-all duration-200 ease-in-out flex flex-col min-w-[280px]
        ${
          visible
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }
      `}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {FILTER_CONFIG.map((f) => (
          <div key={f.key}>
            <label className="block font-semibold mb-1">{f.label}</label>
            {f.type === "select" && (
              <select
                className="w-full border rounded px-2 py-1 cursor-pointer"
                value={filterState[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
              >
                <option value="">{f.placeholder || f.label}</option>
                {(f.fetch ? departments : f.options || []).map((opt) =>
                  f.fetch ? (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ) : (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
                )}
              </select>
            )}
            {f.type === "button" && (
              <div className="flex gap-2 flex-wrap">
                {f.options.map((opt) => (
                  <button
                    key={opt}
                    className={`cursor-pointer px-3 py-1 rounded border ${
                      filterState[f.key] === opt
                        ? "bg-green-900 text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => handleChange(f.key, opt)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {f.type === "slider" && (
              <>
                <Slider
                  range
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={filterState[f.key]}
                  onChange={(v) => handleChange(f.key, v)}
                  allowCross={false}
                  trackStyle={[{ backgroundColor: "#2563eb" }]}
                  handleStyle={[
                    { borderColor: "#2563eb" },
                    { borderColor: "#2563eb" },
                  ]}
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>{filterState[f.key][0]} 만원</span>
                  <span>{filterState[f.key][1]} 만원</span>
                </div>
              </>
            )}
            {f.type === "checkbox" && (
              <div className="flex gap-2 flex-wrap">
                {f.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filterState[f.key]?.includes(opt)}
                      onChange={() => handleMultiSelect(f.key, opt)}
                      className="cursor-pointer"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {f.type === "switch" && (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState[f.key]}
                  onChange={() => handleChange(f.key, !filterState[f.key])}
                />
                {filterState[f.key] ? "허용" : "불가"}
              </label>
            )}
            {f.type === "number" && (
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                placeholder={f.placeholder}
                value={filterState[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                min={0}
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <button
          className={`flex-1 py-2 rounded font-semibold transition
            ${
              hasActiveFilter
                ? "bg-green-600 text-white cursor-pointer hover:bg-green-900 active:scale-98"
                : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            }`}
          onClick={handleApply}
          disabled={!hasActiveFilter}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}
