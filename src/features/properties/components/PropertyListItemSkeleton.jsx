export default function PropertyListItemSkeleton() {
  return (
    <li className="flex p-2 mb-2 mx-1 rounded-md overflow-hidden shadow-sm border-2 border-gray-100 bg-gray-50 animate-pulse">
      <div className="relative w-32 h-24 bg-gray-200 rounded-xl flex-shrink-0"></div>
      <div className="flex-1 p-3 space-y-3">
        <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
      </div>
    </li>
  );
}
