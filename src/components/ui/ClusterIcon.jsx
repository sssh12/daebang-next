import { Circle } from "lucide-react";
export default function ClusterIcon({ recommended, count }) {
  return (
    <div className="relative flex items-center justify-center">
      <Circle
        className={`w-12 h-12 ${
          recommended ? "text-green-600" : "text-gray-500"
        } drop-shadow-lg`}
      />
      <span
        className={`absolute text-lg font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800 rounded-full px-3 py-1 ${
          recommended ? "bg-green-100 text-green-900" : "bg-gray-200"
        }`}
      >
        {count}
      </span>
    </div>
  );
}
