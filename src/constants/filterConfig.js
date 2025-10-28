import {
  TRADE_TYPES,
  DISTANCE_OPTIONS,
  NEARBY_FACILITIES,
  ROOM_TYPES,
  FLOOR_TYPES,
  ROOM_OPTIONS,
  SECURITY_OPTIONS,
  BUILDING_AGE_OPTIONS,
  DIRECTIONS,
  AVAILABILITY_OPTIONS,
} from "./propertyOptions";

const PYEONG_TO_SQM = 3.305785;
const sqmToPyeong = (sqm) => Math.round(sqm / PYEONG_TO_SQM);
const pyeongToSqm = (pyeong) => Math.round(pyeong * PYEONG_TO_SQM);

export const DEPOSIT_SCALE = [
  0,
  1000,
  2000,
  3000,
  4000,
  5000,
  6000,
  7000,
  8000,
  9000,
  10000,
  11000,
  12000,
  13000,
  14000,
  15000,
  16000,
  17000,
  18000,
  19000,
  20000,
  21000,
  22000,
  23000,
  24000,
  25000,
  30000,
  35000,
  40000,
  45000,
  50000,
  Infinity,
];

export const MONTHLY_RENT_SCALE = [
  0,
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
  110,
  120,
  130,
  140,
  150,
  160,
  170,
  180,
  190,
  200,
  210,
  220,
  230,
  240,
  250,
  300,
  350,
  400,
  450,
  500,
  Infinity,
];

export const FILTER_CONFIG = [
  // --- 기본 옵션 ---
  {
    group: "basic",
    key: "department",
    label: "학부 선택",
    type: "select",
    fetch: true,
    placeholder: "학부 선택",
  },
  {
    group: "basic",
    key: "distanceMinutes",
    label: "학교까지 거리",
    type: "radio",
    options: DISTANCE_OPTIONS,
    default: "전체",
  },
  {
    group: "basic",
    key: "tradeType",
    label: "거래 유형",
    type: "radio",
    options: TRADE_TYPES,
    default: "전체",
  },

  {
    group: "basic",
    key: "nearbyFacilities",
    label: "주요 편의시설",
    type: "checkbox",
    options: NEARBY_FACILITIES,
    default: [],
  },
  {
    group: "basic",
    key: "depositIndex",
    label: "보증금",
    type: "slider_custom",
    scale: DEPOSIT_SCALE,
    min: 0,
    max: DEPOSIT_SCALE.length - 1,
    step: 1,
    default: DEPOSIT_SCALE.length - 1,
    unit: "만원",
    midLabelValue: 12000,
  },
  {
    group: "basic",
    key: "monthlyRentIndex",
    label: "월세",
    type: "slider_custom",
    scale: MONTHLY_RENT_SCALE,
    min: 0,
    max: MONTHLY_RENT_SCALE.length - 1,
    step: 1,
    default: MONTHLY_RENT_SCALE.length - 1,
    unit: "만원",
    midLabelValue: 60,
    subLabel: "관리비 포함 여부",
    subKey: "includeMaintenanceFee",
    subType: "checkbox_single",
    subDefault: false,
  },
  {
    group: "basic",
    key: "roomType",
    label: "방 종류",
    type: "radio",
    options: ROOM_TYPES,
    default: "전체",
  },
  {
    group: "basic",
    key: "floorType",
    label: "층수",
    type: "checkbox",
    options: FLOOR_TYPES,
    default: ["1층", "2층 이상", "반지하", "옥탑"],
  },
  {
    group: "basic",
    key: "roomSizePyeongRange",
    label: "방 크기 (평)",
    type: "slider",
    min: 0,
    max: 50,
    step: 1,
    default: [0, 15],
    unit: "평",
  },

  // --- 시설 옵션 ---
  {
    group: "facility",
    key: "roomOptions",
    label: "옵션 선택 (가전 및 가구)",
    type: "checkbox",
    options: ROOM_OPTIONS,
    default: [],
  },
  {
    group: "facility",
    key: "securityOptions",
    label: "보안 옵션",
    type: "checkbox",
    options: SECURITY_OPTIONS,
    default: [],
  },
  {
    group: "facility",
    key: "hasParking",
    label: "주차 가능",
    type: "switch",
    default: false,
  },
  {
    group: "facility",
    key: "hasElevator",
    label: "엘리베이터",
    type: "switch",
    default: false,
  },

  // --- 상세 옵션 ---
  {
    group: "detailed",
    key: "buildingAge",
    label: "사용승인일",
    type: "radio",
    options: BUILDING_AGE_OPTIONS,
    default: "전체",
  },
  {
    group: "detailed",
    key: "moveInDate",
    label: "입주 가능일",
    type: "datepicker",
    availabilityOptions: AVAILABILITY_OPTIONS,
    availabilityKey: "availabilityOptions",
    availabilityDefault: [],
    default: null,
  },
  {
    group: "detailed",
    key: "direction",
    label: "방향",
    type: "checkbox",
    options: DIRECTIONS,
    default: [],
  },
  {
    group: "detailed",
    key: "petAllowed",
    label: "반려동물 가능",
    type: "switch",
    default: false,
  },
  {
    group: "detailed",
    key: "shortTermLease",
    label: "단기 임대 가능",
    type: "switch",
    default: false,
  },
];

export const getDefaultFilterValues = () => {
  const defaults = {};
  FILTER_CONFIG.forEach((config) => {
    defaults[config.key] = config.default;
    if (config.subKey) {
      defaults[config.subKey] = config.subDefault;
    }
    if (config.availabilityKey) {
      defaults[config.availabilityKey] = config.availabilityDefault;
    }
  });
  return defaults;
};
