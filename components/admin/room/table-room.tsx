"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { toast } from "react-toastify";

type Room = {
  id: string;
  name: string;
  price: number;
  image: string;
  createdAt?: any;
};

const TableRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Room[];

        setRooms(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this room?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "rooms", id));

      setRooms((prev) => prev.filter((room) => room.id !== id));

      toast.success("Room deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete room");
    }
  };

  if (loading) {
    return <p className="mt-5 text-gray-600">Loading rooms...</p>;
  }

  return (
    <div className="mt-5">
      {/* MOBILE CARD */}
      <div className="space-y-4 md:hidden">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex gap-4">
              <Image
                src={room.image}
                alt={room.name}
                width={96}
                height={80}
                className="w-24 h-20 object-cover rounded-md flex-none"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {room.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Rp {room.price?.toLocaleString("id-ID")}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {room.createdAt?.toDate
                    ? room.createdAt.toDate().toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Link
                href={`/admin/room/edit/${room.id}`}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                <IoCreateOutline className="size-5" />
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(room.id)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                <IoTrashOutline className="size-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white pt-4 shadow-sm overflow-x-auto">
        <table className="w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left">
                Image
              </th>
              <th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left">
                Room Name
              </th>
              <th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left">
                Price
              </th>
              <th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left">
                Created At
              </th>
              <th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-100">
                <td className="px-6 py-4">
                  <Image
                    src={room.image}
                    alt={room.name}
                    width={100}
                    height={70}
                    className="rounded-md object-cover w-24 h-16"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  {room.name}
                </td>

                <td className="px-6 py-4">
                  Rp {room.price?.toLocaleString("id-ID")}
                </td>

                <td className="px-6 py-4">
                  {room.createdAt?.toDate
                    ? room.createdAt.toDate().toLocaleDateString("id-ID")
                    : "-"}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/room/edit/${room.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      <IoCreateOutline className="size-5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(room.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <IoTrashOutline className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rooms.length === 0 && (
        <p className="text-center py-6 text-gray-500 bg-white rounded-md shadow-sm">
          No rooms found.
        </p>
      )}
    </div>
  );
};

export default TableRoom;