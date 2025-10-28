"use client";

import {
  ROOM_TYPES,
  PRICE_TYPES,
  DISTANCE_TYPES,
  NEARBY_FACILITIES,
  SAFETY_OPTIONS,
  LIVING_OPTIONS,
  MAINTENANCE_INCL,
  LOAN_TYPES,
  ROOM_OPTIONS,
  CONTRACT_PERIODS,
} from "@/constants/propertyOptions";
import { usePropertyForm } from "@/features/properties/hooks/usePropertyForm";

export default function PropertyAddPage() {
  const {
    form,
    imageFiles,
    loading,
    handleChange,
    handlePetToggle,
    handleImageFiles,
    removeImageFile,
    handleSubmit,
  } = usePropertyForm();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-3xl p-8 bg-white rounded shadow ">
        <h1 className="text-2xl font-bold mb-6">매물 등록</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목"
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="상세 설명"
            className="w-full border rounded px-3 py-2"
          />
          <div>
            <span className="block mb-1">거래유형</span>
            {PRICE_TYPES.map((type) => (
              <label key={type} className="mr-4">
                <input
                  type="radio"
                  name="price_type"
                  value={type}
                  checked={form.price_type === type}
                  onChange={handleChange}
                  className="mr-1"
                />
                {type}
              </label>
            ))}
          </div>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="월세/전세/매매가"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="deposit"
            value={form.deposit}
            onChange={handleChange}
            placeholder="보증금"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="maintenance_fee"
            value={form.maintenance_fee}
            onChange={handleChange}
            placeholder="관리비(원)"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <div>
            <span className="block mb-1">방 종류</span>
            {ROOM_TYPES.map((type) => (
              <label key={type} className="mr-4">
                <input
                  type="radio"
                  name="room_type"
                  value={type}
                  checked={form.room_type === type}
                  onChange={handleChange}
                  className="mr-1"
                />
                {type}
              </label>
            ))}
          </div>
          <input
            name="lat"
            value={form.lat}
            onChange={handleChange}
            placeholder="위도"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="lng"
            value={form.lng}
            onChange={handleChange}
            placeholder="경도"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="year_built"
            value={form.year_built}
            onChange={handleChange}
            placeholder="건축년도 (예: 2020)"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="room_size"
            value={form.room_size}
            onChange={handleChange}
            placeholder="방 크기(㎡)"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="floor"
            value={form.floor}
            onChange={handleChange}
            placeholder="층수"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <div>
            <span className="block mb-1">학교까지 거리/시간</span>
            {DISTANCE_TYPES.map((type) => (
              <label key={type} className="mr-4">
                <input
                  type="radio"
                  name="distance_type"
                  value={type}
                  checked={form.distance_type === type}
                  onChange={handleChange}
                  className="mr-1"
                />
                {type}
              </label>
            ))}
          </div>
          <div>
            <span className="block mb-1">주변 시설</span>
            {NEARBY_FACILITIES.map((f) => (
              <label key={f} className="mr-4">
                <input
                  type="checkbox"
                  name="nearby_facilities"
                  value={f}
                  checked={form.nearby_facilities.includes(f)}
                  onChange={handleChange}
                  className="mr-1"
                />
                {f}
              </label>
            ))}
          </div>
          <div>
            <span className="block mb-1">안전 옵션</span>
            {SAFETY_OPTIONS.map((o) => (
              <label key={o} className="mr-4">
                <input
                  type="checkbox"
                  name="safety_options"
                  value={o}
                  checked={form.safety_options.includes(o)}
                  onChange={handleChange}
                  className="mr-1"
                />
                {o}
              </label>
            ))}
          </div>
          <div>
            <span className="block mb-1">주거 환경</span>
            {LIVING_OPTIONS.map((o) => (
              <label key={o} className="mr-4">
                <input
                  type="checkbox"
                  name="living_options"
                  value={o}
                  checked={form.living_options.includes(o)}
                  onChange={handleChange}
                  className="mr-1"
                />
                {o}
              </label>
            ))}
          </div>
          <div>
            <span className="block mb-1">반려동물</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.pet_allowed}
                onChange={handlePetToggle}
                className="mr-2"
              />
              {form.pet_allowed ? "허용" : "불가"}
            </label>
          </div>
          <div>
            <span className="block mb-1">계약 기간</span>
            {CONTRACT_PERIODS.map((p) => (
              <label key={p} className="mr-4">
                <input
                  type="radio"
                  name="contract_period"
                  value={p}
                  checked={form.contract_period === p}
                  onChange={handleChange}
                  className="mr-1"
                />
                {p}
              </label>
            ))}
          </div>
          <div>
            <span className="block mb-1">관리비 포함 항목</span>
            {MAINTENANCE_INCL.map((m) => (
              <label key={m} className="mr-4">
                <input
                  type="checkbox"
                  name="maintenance_incl"
                  value={m}
                  checked={form.maintenance_incl.includes(m)}
                  onChange={handleChange}
                  className="mr-1"
                />
                {m}
              </label>
            ))}
          </div>
          <div>
            <span className="block mb-1">전세 대출</span>
            {LOAN_TYPES.map((l) => (
              <label key={l} className="mr-4">
                <input
                  type="radio"
                  name="loan_type"
                  value={l}
                  checked={form.loan_type === l}
                  onChange={handleChange}
                  className="mr-1"
                />
                {l}
              </label>
            ))}
          </div>
          <div>
            <span className="block mb-1">방 옵션</span>
            {ROOM_OPTIONS.map((o) => (
              <label key={o} className="mr-4">
                <input
                  type="checkbox"
                  name="room_options"
                  value={o}
                  checked={form.room_options.includes(o)}
                  onChange={handleChange}
                  className="mr-1"
                />
                {o}
              </label>
            ))}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageFiles(e.target.files)}
          />
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 border rounded overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1"
                    onClick={() => removeImageFile(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-900 transition-colors cursor-pointer"
            disabled={loading}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </form>
      </div>
    </div>
  );
}
