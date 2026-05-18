"use client";

import Link from "next/link";

const Cards = () => {
  const limitedRooms = rooms.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {limitedRooms.map((room) => (
          <Card key={room.id} room={room} />
        ))}
      </div>

      {rooms.length > 6 && (
        <div className="flex justify-center mt-10">
          <Link
            href="/room"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold"
          >
            View All Rooms
          </Link>
        </div>
      )}
    </>
  );
};