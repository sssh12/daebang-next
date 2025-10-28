import {
  FILTER_CONFIG,
  DEPOSIT_SCALE,
  MONTHLY_RENT_SCALE,
  getDefaultFilterValues,
} from "@/constants/filterConfig";
import { FLOOR_TYPES } from "@/constants/propertyOptions";
import { getDistance } from "./getDistance";

const WALKING_SPEED_MPM = 80;

export const filterComparators = {
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
      ? (Number(p.price) || 0) + (Number(p.maintenance_fee) || 0)
      : Number(p.price) || 0;
    return typeof priceToCheck === "number" && priceToCheck <= maxValue;
  },
  roomType: (p, v, filters) => v === "전체" || p.room_type === v,
  distanceMinutes: (property, filterValue, targetCoords) => {
    if (filterValue === "전체" || !targetCoords?.lat || !targetCoords?.lng) {
      return true;
    }
    const propLat = Number(property.lat);
    const propLng = Number(property.lng);
    if (isNaN(propLat) || isNaN(propLng)) {
      return true;
    }
    const distanceMeters = getDistance(
      targetCoords.lat,
      targetCoords.lng,
      propLat,
      propLng
    );
    const match = filterValue.match(/^(\d+)분 이내$/);
    if (match) {
      const maxMinutes = parseInt(match[1], 10);
      const maxDistance = maxMinutes * WALKING_SPEED_MPM;
      return distanceMeters <= maxDistance;
    }
    if (filterValue === "20분 초과") {
      const minDistance = 20 * WALKING_SPEED_MPM;
      return distanceMeters > minDistance;
    }
    return true;
  },
  nearbyFacilities: (p, v) => v.every((f) => p.nearbyFacilities?.includes(f)),
  floorType: (p, v) => {
    const floorNum = p.floor;
    if (floorNum === null || typeof floorNum !== "number") return true;
    if (v.length === FLOOR_TYPES.length) return true;
    if (v.length === 0) return false;
    let match = false;
    if (v.includes("반지하") && floorNum <= 0) match = true;
    if (!match && v.includes("1층") && floorNum === 1) match = true;
    if (!match && v.includes("2층 이상") && floorNum >= 2) match = true;
    if (!match && v.includes("옥탑") && p.isRooftop === true) match = true;
    return match;
  },
  roomSizeSqmRange: (p, v) => {
    if (!v || !Array.isArray(v) || v.length !== 2) return true;
    const roomSizeNum = Number(p.room_size);
    if (isNaN(roomSizeNum)) return true;
    return roomSizeNum >= v[0] && roomSizeNum <= v[1];
  },
  securityOptions: (p, v) => v.every((s) => p.securityOptions?.includes(s)),
  roomOptions: (p, v) => v.every((r) => p.roomOptions?.includes(r)),
  hasParking: (p, v) => (v ? p.hasParking === true : true),
  hasElevator: (p, v) => (v ? p.hasElevator === true : true),
  buildingAge: (p, v) => {
    if (v === "전체") return true;
    const yearBuiltNum = Number(p.year_built);
    if (isNaN(yearBuiltNum)) return true;
    const currentYear = new Date().getFullYear();
    const age = currentYear - yearBuiltNum;
    const match = v.match(/^(\d+)년 이내$/);
    if (match) {
      const maxAge = parseInt(match[1], 10);
      return age >= 0 && age <= maxAge;
    }
    if (v === "15년 이상") {
      return age >= 15;
    }
    return true;
  },
  moveInDate: (p, v, filters) => {
    const availabilityOptions = filters?.availabilityOptions || [];
    const propertyMoveInDate = p.moveInDate;
    if (v instanceof Date) {
      if (
        typeof propertyMoveInDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(propertyMoveInDate)
      ) {
        try {
          const moveInDate = new Date(propertyMoveInDate + "T00:00:00");
          const selectedDate = new Date(
            v.getFullYear(),
            v.getMonth(),
            v.getDate()
          );
          if (!isNaN(moveInDate.getTime())) {
            return moveInDate <= selectedDate;
          }
        } catch (e) {
          return true;
        }
      }
      if (propertyMoveInDate === "즉시 입주") return true;
      if (propertyMoveInDate === "협의 가능") return true;
      return false;
    }
    if (availabilityOptions.length > 0) {
      if (
        availabilityOptions.includes("즉시 입주 가능") &&
        propertyMoveInDate === "즉시 입주"
      )
        return true;
      if (
        availabilityOptions.includes("협의 가능") &&
        propertyMoveInDate === "협의 가능"
      )
        return true;
      if (
        availabilityOptions.includes("즉시 입주 가능") &&
        typeof propertyMoveInDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(propertyMoveInDate)
      ) {
        try {
          const moveInDate = new Date(propertyMoveInDate + "T00:00:00");
          const today = new Date();
          const todayDateOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          if (!isNaN(moveInDate.getTime()) && moveInDate <= todayDateOnly) {
            return true;
          }
        } catch (e) {
          /* ignore */
        }
      }
      return false;
    }
    return true;
  },
  direction: (p, v) => v.every((d) => p.direction?.includes(d)),
  petAllowed: (p, v) => (v ? p.petAllowed === true : true),
  shortTermLease: (p, v) => (v ? p.shortTermLease === true : true),
};

export function isActiveFilter(key, value, allFilters = null) {
  if (key === "department") {
    const isDepartmentSelected =
      value !== undefined && value !== "" && value !== null;
    if (!isDepartmentSelected || !allFilters) {
      return false;
    }

    const hasOtherActive = Object.entries(allFilters).some(
      ([otherKey, otherValue]) => {
        if (otherKey === "department") return false;
        const config = FILTER_CONFIG.find(
          (f) => f.key === otherKey || f.subKey === otherKey
        );
        if (!config) return false;

        let defaultValue;
        if (config.key === otherKey) defaultValue = config.default;
        else if (config.subKey === otherKey) defaultValue = config.subDefault;
        else if (config.availabilityKey === otherKey)
          defaultValue = config.availabilityDefault;

        if (Array.isArray(defaultValue)) {
          return (
            Array.isArray(otherValue) &&
            otherValue.length !== defaultValue.length
          );
        }

        if (typeof defaultValue === "boolean") {
          return typeof otherValue === "boolean" && otherValue !== defaultValue;
        }

        if (otherKey === "moveInDate") {
          return otherValue !== null;
        }

        if (otherKey === "depositIndex")
          return (
            typeof otherValue === "number" &&
            otherValue !== DEPOSIT_SCALE.length - 1
          );
        if (otherKey === "monthlyRentIndex")
          return (
            typeof otherValue === "number" &&
            otherValue !== MONTHLY_RENT_SCALE.length - 1
          );

        // 기타 값 비교 (예: tradeType, roomType 등)
        return defaultValue === undefined || otherValue !== defaultValue;
      }
    );

    return hasOtherActive;
  }
  // --- ------------------------------------

  if (key === "distanceMinutes") {
    return value !== undefined && value !== "전체";
  }

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
      Array.isArray(value) &&
      value.length === 2 &&
      !(value[0] === defaultValue[0] && value[1] === defaultValue[1])
    );
  }

  if (key === "floorType") {
    const config = FILTER_CONFIG.find((f) => f.key === key);
    const defaultValue = config?.default || FLOOR_TYPES;
    return Array.isArray(value) && value.length !== defaultValue.length;
  }

  if (key === "availabilityOptions") {
    return Array.isArray(value) && value.length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "boolean") {
    const config = FILTER_CONFIG.find((f) => f.key === key || f.subKey === key);
    let defaultValue = false;
    if (config) {
      defaultValue = config.key === key ? config.default : config.subDefault;
    } else {
      const parentConfig = FILTER_CONFIG.find((f) => f.subKey === key);
      if (parentConfig) defaultValue = parentConfig.subDefault;
    }
    return value !== defaultValue;
  }

  if (key === "moveInDate") return value !== null;

  const config = FILTER_CONFIG.find((f) => f.key === key);
  if (!config) return false;
  const defaultValue = config.default;

  return defaultValue === undefined || value !== defaultValue;
}
