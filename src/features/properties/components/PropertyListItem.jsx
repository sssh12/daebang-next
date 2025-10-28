"use client";

import { Star, Square, BedDouble, Building } from "lucide-react";
import Image from "next/image";

const sqmToPyeong = (sqm) => {
  if (!sqm || isNaN(Number(sqm))) return "";
  return (Number(sqm) / 3.305785).toFixed(1);
};

export default function PropertyListItem({
  property,
  highlighted,
  selected,
  onClick,
}) {
  const pyeong = sqmToPyeong(property.room_size);

  return (
    <li
      className={`flex p-3 mb-2 mx-1 rounded overflow-hidden border-2 transition duration-150 ease-in-out cursor-pointer hover:bg-gray-100
        ${
          selected
            ? "border-green-600 bg-green-50/50 shadow-md"
            : highlighted
            ? "border-green-600 bg-gray-50/80"
            : "border-gray-200 bg-white"
        }
      `}
      onClick={onClick}
    >
      <div className="relative w-36 h-28 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden mr-4">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title || "매물 이미지"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            이미지 없음
          </div>
        )}

        {highlighted && (
          <div className="absolute top-1.5 left-1.5 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center shadow">
            <Star className="w-3 h-3 mr-1 fill-white" />
            추천
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="text-lg font-bold truncate mb-1">
            {property.price_type} {property.price?.toLocaleString()}
            {property.deposit ? ` / ${property.deposit.toLocaleString()}` : ""}
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-1 space-x-2">
            {property.room_type && (
              <span className="flex items-center">
                <BedDouble className="w-3.5 h-3.5 mr-1 text-gray-400" />{" "}
                {property.room_type}
              </span>
            )}
            {property.room_size && pyeong && (
              <span className="flex items-center">
                <Square className="w-3.5 h-3.5 mr-1 text-gray-400" /> {pyeong}평
                ({property.room_size}㎡)
              </span>
            )}
            {property.floor && (
              <span className="flex items-center">
                <Building className="w-3.5 h-3.5 mr-1 text-gray-400" />{" "}
                {property.floor}층
              </span>
            )}
          </div>

          <p className="text-base text-gray-800 truncate mb-2">
            {property.title}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            관리비{" "}
            {property.maintenance_fee !== null &&
            property.maintenance_fee !== undefined &&
            !isNaN(Number(property.maintenance_fee))
              ? `${Number(property.maintenance_fee).toLocaleString()}원`
              : "없음"}
          </div>

          <div className="flex flex-wrap gap-1 justify-end items-center mt-1">
            {property.hasParking && (
              <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                주차
              </span>
            )}
            {property.pet_allowed && (
              <span className="bg-pink-100 text-pink-700 text-xs px-1.5 py-0.5 rounded">
                반려동물
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
