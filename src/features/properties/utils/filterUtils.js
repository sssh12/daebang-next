import {
  FILTER_CONFIG,
  DEPOSIT_SCALE,
  MONTHLY_RENT_SCALE,
} from "@/constants/filterConfig";
import { FLOOR_TYPES } from "@/constants/propertyOptions";

export const filterComparators = {
  department: (p, v) =>
    Array.isArray(v) ? v.includes(p.department_id) : p.department_id === v,
  tradeType: (p, v, filters) => v === "전체" || p.price_type === v,

  depositIndex: (p, index) => {
    const maxValue = DEPOSIT_SCALE[index];
    if (maxValue === Infinity) return true;
    return typeof p.deposit === "number" && p.deposit <= maxValue;
  },
  monthlyRentIndex: (p, index, filters) => {
    const maxValue = MONTHLY_RENT_SCALE[index];
    if (maxValue === Infinity) return true;

    const priceToCheck = filters.includeMaintenanceFee
      ? (p.price || 0) + (p.maintenance_fee || 0)
      : p.price || 0;

    return typeof priceToCheck === "number" && priceToCheck <= maxValue;
  },

  roomType: (p, v, filters) => v === "전체" || p.room_type === v,
  distanceMinutes: (p, v, filters) => v === "전체", // TODO: 'distanceMinutes' 실제 비교 로직 구현 필요

  nearbyFacilities: (p, v) => v.every((f) => p.nearby_facilities?.includes(f)),

  floorType: (p, v) => {
    if (!Array.isArray(v) || v.length === 0) return false;
    if (v.length === FLOOR_TYPES.length) return true;

    // TODO: p.floor (숫자)와 v (문자열 배열) 비교 로직 구현 필요

    return true; // 임시: 로직 구현 전까지 통과
  },

  roomSizeSqmRange: (p, v) => {
    if (!v || !Array.isArray(v) || v.length !== 2) return true;
    return (
      typeof p.room_size === "number" &&
      p.room_size >= v[0] &&
      p.room_size <= v[1]
    );
  },

  securityOptions: (p, v) => v.every((s) => p.security_options?.includes(s)),
  roomOptions: (p, v) => v.every((r) => p.room_options?.includes(r)),

  hasParking: (p, v) => (v ? p.has_parking === true : true),
  hasElevator: (p, v) => (v ? p.has_elevator === true : true),

  buildingAge: (p, v, filters) => v === "전체", // TODO: 'buildingAge' 실제 비교 로직 구현 필요

  moveInDate: (p, v) => {
    if (!v) return true;
    // TODO: p.move_in_date (날짜)와 v (선택 날짜) 비교 로직 구현
    return true;
  },
  availabilityOptions: (p, v) => {
    if (!v || v.length === 0) return true;
    // TODO: p.move_in_type ('즉시 입주', '협의 가능', '날짜 지정') 등 컬럼과 비교 로직 구현
    return true;
  },

  direction: (p, v) => v.every((d) => p.direction?.includes(d)), // TODO: 컬럼명 확인

  petAllowed: (p, v) => (v ? p.pet_allowed === true : true),
  shortTermLease: (p, v) => (v ? p.short_term_lease === true : true), // TODO: 컬럼명 확인
};

export function isActiveFilter(key, value) {
  if (key === "depositIndex") {
    return typeof value === "number" && value !== DEPOSIT_SCALE.length - 1;
  }
  if (key === "monthlyRentIndex") {
    return typeof value === "number" && value !== MONTHLY_RENT_SCALE.length - 1;
  }

  if (key === "includeMaintenanceFee") {
    return value === true;
  }

  if (key === "roomSizePyeongRange") {
    const config = FILTER_CONFIG.find((f) => f.key === key);
    const defaultValue = config?.default || [0, 15];
    return (
      value && !(value[0] === defaultValue[0] && value[1] === defaultValue[1])
    );
  }

  if (key === "floorType") {
    const config = FILTER_CONFIG.find((f) => f.key === key);
    const defaultLength = config?.default?.length || 0;

    return value.length !== defaultLength;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "boolean") return value;

  if (key === "department") return value !== undefined && value !== "";

  if (key === "moveInDate") return value !== null;

  const config = FILTER_CONFIG.find((f) => f.key === key);
  const defaultValue = config?.default;

  return defaultValue === undefined || value !== defaultValue;
}
