"use client";
export default function PropertyListItem({
  property,
  highlighted,
  selected,
  onClick,
}) {
  return (
    <li
      className={`flex px-2 py-2 rounded-lg overflow-hidden shadow-sm hover:shadow-lg cursor-pointer transition
        ${highlighted ? " bg-emerald-100" : ""}
      `}
      onClick={onClick}
    >
      <div className="w-32 h-24 bg-gray-100 rounded-xl flex-shrink-0">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="object-cover rounded-xl w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1 p-3">
        {highlighted && (
          <div className="text-xs text-white bg-main px-2 py-0.5 rounded-full inline-block mb-1">
            추천
          </div>
        )}
        <div className="font-bold text-lg">{property.title}</div>
        <div className="text-main font-semibold mt-1">
          {property.price_type} {property.price?.toLocaleString()}
          {property.deposit
            ? ` / 보증금 ${property.deposit.toLocaleString()}`
            : ""}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {property.room_type} ·{" "}
          {property.room_size ? `${property.room_size}㎡` : ""} ·{" "}
          {property.floor ? `${property.floor}층` : ""}
        </div>
        <div className="text-xs text-gray-400 mt-1">
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
        <div className="flex flex-wrap gap-1 mt-1">
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
      </div>
    </li>
  );
}
