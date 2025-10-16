"use client";

import { useState } from "react";
import { Undo2, Heart, Share2 } from "lucide-react";

export default function PropertyDetail({ property, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);

  if (!property) return null;

  const images = property.images?.length ? property.images : [];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white flex items-center text-xl m-3 mt-7 font-bold relative">
        <Undo2
          className="w-12 h-12 cursor-pointer rounded p-3 hover:bg-gray-200 transition"
          onClick={onClose}
        />
        <div className="absolute left-0 right-0 flex justify-center items-center pointer-events-none">
          <span>매물 {property.id}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center">
          <Heart className="w-12 h-12 cursor-pointer rounded p-3 hover:bg-gray-200 transition" />
          <Share2 className="w-12 h-12 cursor-pointer rounded p-3 hover:bg-gray-200 transition" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="relative w-full h-72 bg-gray-100 flex items-center justify-center">
          {images.length > 0 ? (
            <>
              <img
                src={images[imgIdx]}
                alt={`매물 이미지 ${imgIdx + 1}`}
                className="object-cover w-full h-full"
              />
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full px-2 py-1 cursor-pointer"
                    onClick={() =>
                      setImgIdx((i) => (i === 0 ? images.length - 1 : i - 1))
                    }
                  >
                    ◀
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full px-2 py-1 cursor-pointer"
                    onClick={() =>
                      setImgIdx((i) => (i === images.length - 1 ? 0 : i + 1))
                    }
                  >
                    ▶
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`inline-block w-2 h-2 rounded-full ${
                          idx === imgIdx ? "bg-main" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="font-bold text-xl">{property.title}</div>
          <div className="text-main font-semibold">
            {property.price_type} {property.price?.toLocaleString()}만원
            {property.deposit
              ? ` / 보증금 ${property.deposit.toLocaleString()}만원`
              : ""}
          </div>
          <div className="text-sm text-gray-500">
            {property.room_type} ·{" "}
            {property.room_size ? `${property.room_size}㎡` : ""} ·{" "}
            {property.floor ? `${property.floor}층` : ""}
          </div>
          <div className="text-xs text-gray-400">
            관리비{" "}
            {property.maintenance_fee !== null &&
            property.maintenance_fee !== undefined &&
            property.maintenance_fee !== "" &&
            !isNaN(Number(property.maintenance_fee)) &&
            Number(property.maintenance_fee) !== 0
              ? `${Number(property.maintenance_fee).toLocaleString()}`
              : Number(property.maintenance_fee) === 0
              ? "0"
              : "없음"}
            {property.distance_type ? ` · ${property.distance_type}` : ""}
          </div>
          <div className="flex flex-wrap gap-1">
            {property.safety_options?.map((opt) => (
              <span
                key={opt}
                className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded"
              >
                {opt}
              </span>
            ))}
            {property.living_options?.map((opt) => (
              <span
                key={opt}
                className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded"
              >
                {opt}
              </span>
            ))}
            {property.pet_allowed && (
              <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded">
                반려동물
              </span>
            )}
          </div>
          <div className="mt-2 text-gray-700 text-sm whitespace-pre-line">
            {property.description}
          </div>
        </div>
      </div>
      <div className="p-4 border-t flex gap-2">
        <button className="flex-1 font-semibold bg-accent hover:bg-main text-white py-2 rounded active:scale-98 transition cursor-pointer">
          문의하기
        </button>
      </div>
    </div>
  );
}
