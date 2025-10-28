export default function PropertyListItemSkeleton() {
  return (
    <li className="flex p-3 mb-2 mx-1 rounded overflow-hidden border-2 bg-gray-50 animate-pulse shadow-sm border-gray-100">
      <div className="relative w-36 h-31 bg-gray-200 rounded-md flex-shrink-0 mr-4"></div>

      <div className="flex-1 flex flex-col justify-between overflow-hidden py-2">
        <div>
          <div className="w-2/3 h-7 bg-gray-200 rounded mb-2"></div>

          <div className="flex items-center space-x-2 mb-2">
            <div className="w-14 h-5 bg-gray-200 rounded"></div>
            <div className="w-20 h-5 bg-gray-200 rounded"></div>
            <div className="w-12 h-5 bg-gray-200 rounded"></div>
          </div>

          <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
        </div>

        <div className="flex items-center justify-between ">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="flex gap-1">
            <div className="w-10 h-4 bg-gray-200 rounded"></div>
            <div className="w-12 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </li>
  );
}
