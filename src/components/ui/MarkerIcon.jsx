import { MapPin, Star } from "lucide-react";

export default function MarkerIcon({ recommended }) {
  return (
    <span
      className={
        recommended
          ? "inline-flex items-center justify-center w-11 h-11 rounded-full bg-green-100 shadow-lg border-3 border-green-500"
          : "inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 shadow border-3 border-gray-400"
      }
    >
      {recommended ? (
        <Star className="w-6 h-6 text-green-700 drop-shadow m-2" />
      ) : (
        <MapPin className="w-6 h-6 text-gray-500 m-2" />
      )}
    </span>
  );
}
