import CardSkeleton from "@/components/skeletons/card-skeleton";

const RoomSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default RoomSkeleton;