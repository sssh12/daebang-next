import {
  FILTER_CONFIG,
  DEPOSIT_SCALE,
  MONTHLY_RENT_SCALE,
} from "@/constants/filterConfig";

export const filterComparators = {
  department: (p, v) =>
    Array.isArray(v) ? v.includes(p.department_id) : p.department_id === v,
  tradeType: (p, v) => p.price_type === v,
  depositRange: (p, v) =>
    typeof p.deposit === "number" && p.deposit >= v[0] && p.deposit <= v[1],
  priceRange: (p, v) =>
    typeof p.price === "number" && p.price >= v[0] && p.price <= v[1],
  roomType: (p, v) =>
    Array.isArray(v) ? v.includes(p.room_type) : p.room_type === v,
  distanceType: (p, v) => p.distance_type === v,
  facilities: (p, v) => v.every((f) => p.nearby_facilities?.includes(f)),
  safety: (p, v) => v.every((s) => p.safety_options?.includes(s)),
  living: (p, v) => v.every((l) => p.living_options?.includes(l)),
  petAllowed: (p, v) => (v ? p.pet_allowed : true),
  contractPeriod: (p, v) => p.contract_period === v,
  maintenanceIncl: (p, v) => v.every((m) => p.maintenance_incl?.includes(m)),
  loanType: (p, v) => p.loan_type === v,
  roomOptions: (p, v) => v.every((r) => p.room_options?.includes(r)),
  roomSize: (p, v) =>
    typeof p.room_size === "number" && p.room_size >= Number(v),
  floor: (p, v) => typeof p.floor === "number" && p.floor === Number(v),
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
  if (Array.isArray(value)) return value.length > 0;

  if (typeof value === "boolean") return value;

  if (key === "department") return value !== undefined && value !== "";

  const config = FILTER_CONFIG.find((f) => f.key === key);
  const defaultValue = config?.default;

  return defaultValue === undefined || value !== defaultValue;
}
