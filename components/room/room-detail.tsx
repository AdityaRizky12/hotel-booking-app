"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { useParams } from "next/navigation";
import {
  IoPersonOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import ReservationForm from "./reservation-form";

type Room = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  capacity: number;
  amenities: string[];
};

const RoomDetail = () => {

  const { id } = useParams();

  const [room, setRoom] =
    useState<Room | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const getRoom = async () => {

      try {

        const docRef = doc(
          db,
          "rooms",
          id as string
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {

          setRoom({
            id: docSnap.id,
            ...docSnap.data(),
          } as Room);

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    if (id) {
      getRoom();
    }

  }, [id]);

  if (loading) {

    return (
      <p className="text-center py-10">
        Loading room...
      </p>
    );

  }

  if (!room) {

    return (
      <p className="text-center py-10">
        Room not found.
      </p>
    );

  }

  return (

    <div className="grid lg:grid-cols-12 gap-10">

      {/* LEFT */}
      <div className="lg:col-span-8">

        {/* IMAGE */}
        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden">

          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover"
          />

        </div>

        {/* CONTENT */}
        <div className="mt-8">

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            {room.name}
          </h1>

          {/* CAPACITY */}
          <div className="flex items-center gap-2 mt-4 text-gray-600">

            <IoPersonOutline className="size-5 text-orange-500" />

            <span className="font-medium">
              {room.capacity} Guests
            </span>

          </div>

          {/* PRICE */}
          <div className="mt-4">

            <h2 className="text-2xl font-bold text-orange-500">

              Rp{" "}
              {room.price.toLocaleString(
                "id-ID"
              )}

              <span className="text-sm text-gray-500 font-normal">
                {" "}
                / night
              </span>

            </h2>

          </div>

          {/* DESCRIPTION */}
          <div className="mt-8">

            <h2 className="text-2xl font-bold mb-4">
              Description
            </h2>

            <p className="text-gray-600 leading-8">
              {room.description}
            </p>

          </div>

          {/* AMENITIES */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-5">
              Amenities
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

              {room.amenities?.map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-md p-4"
                  >

                    <IoCheckmarkCircle className="size-5 text-green-500" />

                    <span className="text-gray-700 font-medium">
                      {item}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="lg:col-span-4">

        <ReservationForm room={room} />

      </div>

    </div>

  );
};

export default RoomDetail;