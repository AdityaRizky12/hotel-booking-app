"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { IoPersonOutline } from "react-icons/io5";
import RoomSkeleton from "@/components/skeletons/room-skeleton";

type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  capacity: number;
  amenities: string[];
};

const Cards = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Room[];

        setRooms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, []);

 if (loading) {
  return <RoomSkeleton />;
}
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition"
        >
          <div className="relative w-full h-64">
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
              {room.name}
            </h3>

            <p className="text-gray-600 text-sm mt-3 line-clamp-3">
              {room.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
      <IoPersonOutline className="size-5 text-orange-500" />
           <span>
        Capacity:{" "}
    <span className="font-semibold text-gray-800">
         {room.capacity} guests
       </span>
     </span>
     </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-lg font-bold text-gray-900">
                Rp {room.price?.toLocaleString("id-ID")}
                <span className="text-sm font-normal text-gray-500">
                  {" "} / night
                </span>
              </p>
            </div>

            <Link
              href={`/rooms/${room.id}`}
              className="mt-5 block w-full text-center bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition"
            >
              View Detail
            </Link>
          </div>
        </div>
      ))}

      {rooms.length === 0 && (
        <p className="text-gray-500 col-span-full text-center">
          No rooms available.
        </p>
      )}
    </div>
  );
};

export default Cards;