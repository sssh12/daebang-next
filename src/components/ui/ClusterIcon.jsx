import { Circle } from "lucide-react";
export default function ClusterIcon({ recommended, count }) {
  return (
    <div className="relative flex items-center justify-center">
      <Circle
        className={`w-10 h-10 ${
          recommended ? "text-accent" : "text-gray-500"
        } drop-shadow-lg`}
      />
      <span
        className={`absolute text-xs font-bold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black`}
      >
        {count}
      </span>
    </div>
  );
}
