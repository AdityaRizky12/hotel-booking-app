const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full h-64 bg-gray-200" />

      <div className="p-6">
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-5" />
        <div className="h-12 bg-gray-200 rounded-md w-full" />
      </div>
    </div>
  );
};

export default CardSkeleton;