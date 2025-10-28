"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FILTER_CONFIG,
  getDefaultFilterValues,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// 평 <-> 제곱미터 변환 함수
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

export default function FilterPanel({ visible, onApply, onClose }) {
  const supabase = createClient();
  const [departments, setDepartments] = useState([]);
  const [filterState, setFilterState] = useState(getDefaultFilterValues());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
    if (key === "department" && value === "") {
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

  const handleRangeInputChange = (key, index, event) => {
    const newValue = Number(event.target.value);
    const currentValue = filterState[key];
    let newRange = [...currentValue];
    const config = FILTER_CONFIG.find((f) => f.key === key);
    const min = config?.min ?? 0;
    const max = config?.max ?? Infinity;

    if (index === 0) {
      newRange[0] = Math.max(min, Math.min(newValue, currentValue[1]));
    } else {
      newRange[1] = Math.min(max, Math.max(newValue, currentValue[0]));
    }
    handleChange(key, newRange);
  };

  const handleAvailabilityChange = (key, itemValue, checked) => {
    setFilterState((prev) => {
      const currentValues = prev[key] || [];
      let newValues;
      if (checked === true) {
        newValues = [...currentValues, itemValue];
        if (key === "availabilityOptions") {
          handleChange("moveInDate", null);
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
    // TODO: buildingAge, distanceMinutes 값 변환 로직 추가

    onApply?.(finalFilters);
  };

  const hasActiveFilter = Object.entries(filterState).some(([key, value]) =>
    isActiveFilter(key, value)
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
        transition-all duration-200 ease-in-out flex flex-col min-w-[280px]
        ${
          visible
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }
      `}
    >
      <Accordion
        type="multiple"
        defaultValue={["basic"]}
        className="flex-1 overflow-y-auto px-4"
      >
        {Object.entries(groupedFilters).map(([groupKey, configs]) => (
          <AccordionItem value={groupKey} key={groupKey}>
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              {" "}
              {GROUP_LABELS[groupKey] || "기타"}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2 pb-4">
                {" "}
                {configs.map((f) => (
                  <div key={f.key} className="space-y-2">
                    {" "}
                    <Label
                      htmlFor={f.key}
                      className="font-medium text-sm text-gray-800"
                    >
                      {f.label}
                    </Label>{" "}
                    {f.type === "select" && f.key === "department" && (
                      <Select
                        value={
                          filterState[f.key]
                            ? String(filterState[f.key])
                            : undefined
                        }
                        onValueChange={(value) => {
                          const finalValue = value ? Number(value) : undefined;
                          handleChange(f.key, finalValue);
                        }}
                      >
                        <SelectTrigger id={f.key} className="h-10 text-sm">
                          {" "}
                          <SelectValue placeholder={f.placeholder || f.label} />
                        </SelectTrigger>
                        <SelectContent>
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
                          value={filterState[f.key]}
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
                          {" "}
                          {f.options.map((opt) => (
                            <div key={opt}>
                              <Checkbox
                                id={`${f.key}-${opt}`}
                                checked={filterState[f.key]?.includes(opt)}
                                onCheckedChange={(checked) =>
                                  handleMultiCheckboxChange(f.key, opt, checked)
                                }
                                className="sr-only"
                              />
                              <Label
                                htmlFor={`${f.key}-${opt}`}
                                className={cn(
                                  "cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors",
                                  filterState[f.key]?.includes(opt)
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
                    {f.type === "slider" && f.key === "roomSizePyeongRange" && (
                      <div className="pt-1 space-y-3">
                        <div className="flex gap-2 items-center">
                          <span className="text-sm font-medium w-16 text-center">
                            {filterState[f.key][0]}
                            {f.unit}
                          </span>
                          <Slider
                            id={f.key}
                            min={f.min}
                            max={f.max}
                            step={f.step}
                            value={filterState[f.key]}
                            onValueChange={(value) =>
                              handleRangeSliderChange(f.key, value)
                            }
                            className="flex-1 mx-1"
                          />

                          <span className="text-sm font-medium w-16 text-center">
                            {filterState[f.key][1]}
                            {f.max === filterState[f.key][1] ? "+" : ""}
                            {f.unit}
                          </span>
                        </div>
                      </div>
                    )}
                    {f.type === "switch" && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={f.key}
                          checked={filterState[f.key]}
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
                                !filterState[f.key] && "text-muted-foreground",
                                filterState[f.availabilityKey]?.length > 0 &&
                                  "text-muted-foreground opacity-70"
                              )}
                              disabled={
                                filterState[f.availabilityKey]?.length > 0
                              }
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {filterState[f.key] ? (
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
                              selected={filterState[f.key]}
                              onSelect={handleDateSelect}
                              initialFocus
                              locale={ko}
                            />
                          </PopoverContent>
                        </Popover>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                          {" "}
                          {f.availabilityOptions?.map((opt) => (
                            <div
                              key={opt}
                              className="flex items-center space-x-2"
                            >
                              {" "}
                              <Checkbox
                                id={`${f.availabilityKey}-${opt}`}
                                checked={filterState[
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
                                {" "}
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="p-4 border-t">
        <Button
          className="w-full h-10 text-base"
          onClick={handleApply}
          disabled={!hasActiveFilter}
        >
          적용하기
        </Button>
      </div>
    </div>
  );
}
