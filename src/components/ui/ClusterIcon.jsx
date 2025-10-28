export default function ClusterIcon({ recommended, count }) {
  return (
    <div className="relative flex items-center justify-center">
      <span
        className={`absolute text-xl font-extrabold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3.5 py-1.5 hover:scale-112 active:scale-116 shadow-lg transition ${
          recommended
            ? "border-3 border-green-500 bg-green-100 text-green-900 drop-shadow"
            : "border-3 border-gray-400 bg-gray-100 text-gray-700"
        }`}
      >
        {count}
      </span>
    </div>
  );
}
