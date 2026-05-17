import RoomList from "@/components/room/room-list";

const RoomPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-3">
        Rooms & Rates
      </h1>

      <p className="text-gray-500 mb-8">
        Find the best room for your stay.
      </p>

      <RoomList />
    </div>
  );
};

export default RoomPage;