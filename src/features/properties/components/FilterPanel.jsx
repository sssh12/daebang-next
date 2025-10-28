"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FILTER_CONFIG,
  DEPOSIT_SCALE,
  MONTHLY_RENT_SCALE,
} from "@/constants/filterConfig";
import { isActiveFilter } from "../utils/filterUtils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PYEONG_TO_SQM = 3.305785;
const sqmToPyeong = (sqm) => Math.round(sqm / PYEONG_TO_SQM);
const pyeongToSqm = (pyeong) => Math.round(pyeong * PYEONG_TO_SQM);

const GROUP_LABELS = {
  basic: "기본 옵션",
  facility: "시설 옵션",
  detailed: "상세 옵션",
};

const formatCurrency = (value, unit = "만원") => {
  if (value === Infinity) return "무제한";
  if (value >= 10000) {
    const eok = Math.floor(value / 10000);
    const man = value % 10000;
    return `${eok}억${man > 0 ? ` ${man.toLocaleString()}${unit}` : ""}`;
  }
  return `${value.toLocaleString()}${unit}`;
};

const SELECT_PLACEHOLDER_VALUE = "__none__";

export default function FilterPanel({
  visible,
  initialValues,
  onApply,
  onClose,
}) {
  const supabase = createClient();
  const [departments, setDepartments] = useState([]);
  const [filterState, setFilterState] = useState(initialValues);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFilterState(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    const depConfig = FILTER_CONFIG.find(
      (f) => f.key === "department" && f.fetch
    );
    if (depConfig) {
      supabase
        .from("department")
        .select("id, name")
        .then(({ data, error }) => {
          if (error) console.error("Error fetching departments:", error);
          else setDepartments(data || []);
        })
        .catch((error) =>
          console.error("Unexpected error fetching departments:", error)
        );
    }
  }, [supabase]);

  const handleChange = (key, value) => {
    if (
      key === "department" &&
      (value === SELECT_PLACEHOLDER_VALUE ||
        value === undefined ||
        value === null ||
        value === "")
    ) {
      setFilterState((prev) => ({ ...prev, [key]: undefined }));
    } else {
      setFilterState((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleMultiCheckboxChange = (key, itemValue, checked) => {
    setFilterState((prev) => {
      const currentValues = prev[key] || [];
      if (checked === true) {
        return { ...prev, [key]: [...currentValues, itemValue] };
      } else {
        return { ...prev, [key]: currentValues.filter((v) => v !== itemValue) };
      }
    });
  };

  const handleRangeSliderChange = (key, valueArray) => {
    handleChange(key, valueArray);
  };

  const handleAvailabilityChange = (key, itemValue, checked) => {
    setFilterState((prev) => {
      const currentValues = prev[key] || [];
      let newValues;
      if (checked === true) {
        newValues = [...currentValues, itemValue];
        if (key === "availabilityOptions") {
          return { ...prev, [key]: newValues, moveInDate: null };
        }
      } else {
        newValues = currentValues.filter((v) => v !== itemValue);
      }
      return { ...prev, [key]: newValues };
    });
  };

  const handleDateSelect = (date) => {
    handleChange("moveInDate", date);
    handleChange("availabilityOptions", []);
    setIsDatePickerOpen(false);
  };

  const handleApply = () => {
    const finalFilters = { ...filterState };
    if (finalFilters.roomSizePyeongRange) {
      finalFilters.roomSizeSqmRange = [
        pyeongToSqm(finalFilters.roomSizePyeongRange[0]),
        pyeongToSqm(finalFilters.roomSizePyeongRange[1]),
      ];
    }
    onApply?.(finalFilters);
  };

  const hasActiveFilter = Object.entries(filterState || {}).some(
    ([key, value]) => isActiveFilter(key, value, filterState)
  );

  const groupedFilters = FILTER_CONFIG.reduce((acc, config) => {
    const group = config.group || "unknown";
    if (!acc[group]) acc[group] = [];
    acc[group].push(config);
    return acc;
  }, {});

  return (
    <div
      className={`
        absolute top-16 w-full h-[calc(100%-64px)] bg-white shadow-lg z-10
        transition-all duration-200 ease-in-out flex flex-col min-w-[280px] overflow-hidden
        ${
          visible
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }
      `}
    >
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-2">
        <Accordion type="multiple" defaultValue={["basic"]} className="w-full">
          {Object.entries(groupedFilters).map(([groupKey, configs]) => (
            <AccordionItem value={groupKey} key={groupKey} className="border-b">
              <AccordionTrigger className="text-base font-semibold hover:no-underline py-3">
                {GROUP_LABELS[groupKey] || "기타"}
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="space-y-5">
                  {configs.map((f) => {
                    if (
                      f.key === "distanceMinutes" &&
                      !filterState?.department
                    ) {
                      return null;
                    }

                    return (
                      <div key={f.key} className="space-y-2.5">
                        <Label
                          htmlFor={f.key}
                          className="font-medium text-sm text-gray-800"
                        >
                          {f.label}
                        </Label>

                        {f.type === "select" && f.key === "department" && (
                          <Select
                            value={
                              filterState?.[f.key] !== undefined &&
                              filterState?.[f.key] !== null
                                ? String(filterState[f.key])
                                : SELECT_PLACEHOLDER_VALUE
                            }
                            onValueChange={(value) => {
                              const finalValue =
                                value === SELECT_PLACEHOLDER_VALUE
                                  ? undefined
                                  : Number(value);
                              handleChange(f.key, finalValue);
                            }}
                          >
                            <SelectTrigger id={f.key} className="h-10 text-sm">
                              <SelectValue
                                placeholder={f.placeholder || f.label}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={SELECT_PLACEHOLDER_VALUE}>
                                {f.placeholder || f.label}
                              </SelectItem>
                              {departments.map((opt) => (
                                <SelectItem key={opt.id} value={String(opt.id)}>
                                  {opt.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {f.type === "radio" &&
                          [
                            "tradeType",
                            "roomType",
                            "distanceMinutes",
                            "buildingAge",
                          ].includes(f.key) && (
                            <ToggleGroup
                              type="single"
                              id={f.key}
                              value={filterState?.[f.key]}
                              onValueChange={(value) => {
                                if (value) handleChange(f.key, value);
                              }}
                              className="flex flex-wrap justify-start gap-2"
                            >
                              {f.options.map((opt) => (
                                <ToggleGroupItem
                                  key={opt}
                                  value={opt}
                                  variant="outline"
                                  size="sm"
                                  className="text-sm rounded-md data-[state=on]:bg-green-600 data-[state=on]:text-white"
                                >
                                  {opt}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                          )}

                        {/* --- Checkbox (Multiple: 편의시설, 층수, 옵션, 보안, 방향) --- */}
                        {f.type === "checkbox" &&
                          Array.isArray(f.default) &&
                          [
                            "nearbyFacilities",
                            "floorType",
                            "roomOptions",
                            "securityOptions",
                            "direction",
                          ].includes(f.key) && (
                            <div id={f.key} className="flex flex-wrap gap-2">
                              {f.options.map((opt) => (
                                <div key={opt}>
                                  <Checkbox
                                    id={`${f.key}-${opt}`}
                                    checked={filterState?.[f.key]?.includes(
                                      opt
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleMultiCheckboxChange(
                                        f.key,
                                        opt,
                                        checked
                                      )
                                    }
                                    className="hidden"
                                  />
                                  <Label
                                    htmlFor={`${f.key}-${opt}`}
                                    className={cn(
                                      "cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors",
                                      filterState?.[f.key]?.includes(opt)
                                        ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                                        : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    )}
                                  >
                                    {opt}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* --- Slider (보증금, 월세) --- */}
                        {f.type === "slider_custom" && f.scale && (
                          <div className="pt-1 space-y-2">
                            <div className="text-right text-sm font-semibold text-green-700 pr-1 h-5">
                              0 ~{" "}
                              {formatCurrency(
                                f.scale[filterState?.[f.key] ?? f.default],
                                f.unit
                              )}
                            </div>
                            <Slider
                              id={f.key}
                              min={f.min}
                              max={f.max}
                              step={f.step}
                              value={[filterState?.[f.key] ?? f.default]}
                              onValueChange={(value) =>
                                handleChange(f.key, value[0])
                              }
                              className="w-full mt-1 mb-1"
                            />
                            <div className="flex justify-between text-xs text-gray-500 px-1 pt-0.5">
                              <span>최소</span>
                              <span>
                                ~
                                {formatCurrency(
                                  f.midLabelValue ||
                                    f.scale[Math.floor(f.scale.length / 2)],
                                  f.unit
                                )}
                              </span>
                              <span>최대</span>
                            </div>
                            {f.subKey && f.subType === "checkbox_single" && (
                              <div className="flex items-center space-x-2 justify-end pt-1">
                                <Checkbox
                                  id={f.subKey}
                                  checked={!!filterState?.[f.subKey]}
                                  onCheckedChange={(checked) =>
                                    handleChange(f.subKey, Boolean(checked))
                                  }
                                />
                                <Label
                                  htmlFor={f.subKey}
                                  className="font-normal text-sm"
                                >
                                  {f.subLabel}
                                </Label>
                              </div>
                            )}
                          </div>
                        )}

                        {/* --- 범위 슬라이더 (방 크기 - 평) --- */}
                        {f.type === "slider" &&
                          f.key === "roomSizePyeongRange" && (
                            <div className="pt-1 space-y-3">
                              <Slider
                                id={f.key}
                                min={f.min}
                                max={f.max}
                                step={f.step}
                                value={filterState?.[f.key] ?? f.default}
                                onValueChange={(value) =>
                                  handleRangeSliderChange(f.key, value)
                                }
                                className="w-full"
                              />
                              {filterState?.[f.key] && (
                                <div className="flex justify-between text-sm text-gray-600 mt-1 px-1">
                                  <span>
                                    {filterState[f.key][0]}
                                    {f.unit}
                                  </span>
                                  <span>
                                    {filterState[f.key][1]}
                                    {f.max === filterState[f.key][1] ? "+" : ""}
                                    {f.unit}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                        {f.type === "switch" && (
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={f.key}
                              checked={filterState?.[f.key] ?? f.default}
                              onCheckedChange={(checked) =>
                                handleChange(f.key, checked)
                              }
                            />
                          </div>
                        )}

                        {f.type === "datepicker" && (
                          <div className="space-y-2.5">
                            <Popover
                              open={isDatePickerOpen}
                              onOpenChange={setIsDatePickerOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  id={f.key}
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal h-10 text-sm",
                                    !filterState?.[f.key] &&
                                      "text-muted-foreground",
                                    filterState?.[f.availabilityKey]?.length >
                                      0 && "text-muted-foreground opacity-70"
                                  )}
                                  disabled={
                                    filterState?.[f.availabilityKey]?.length > 0
                                  }
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {filterState?.[f.key] ? (
                                    format(filterState[f.key], "PPP", {
                                      locale: ko,
                                    })
                                  ) : (
                                    <span>날짜 선택</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={filterState?.[f.key]}
                                  onSelect={handleDateSelect}
                                  initialFocus
                                  locale={ko}
                                />
                              </PopoverContent>
                            </Popover>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                              {f.availabilityOptions?.map((opt) => (
                                <div
                                  key={opt}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`${f.availabilityKey}-${opt}`}
                                    checked={filterState?.[
                                      f.availabilityKey
                                    ]?.includes(opt)}
                                    onCheckedChange={(checked) =>
                                      handleAvailabilityChange(
                                        f.availabilityKey,
                                        opt,
                                        checked
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`${f.availabilityKey}-${opt}`}
                                    className="font-normal text-sm"
                                  >
                                    {opt}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="p-4 border-t flex gap-2 flex-shrink-0">
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
