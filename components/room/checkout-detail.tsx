"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { toast } from "react-toastify";
import { auth } from "@/firebase/firebase.config";

type Room = {
  id: string;
  name: string;
  image: string;
  price: number;
};

const CheckoutDetail = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fullName = searchParams.get("fullName") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() -
              new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  useEffect(() => {
    const getRoom = async () => {
      try {
        const docRef = doc(db, "rooms", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRoom({
            id: docSnap.id,
            ...docSnap.data(),
          } as Room);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load checkout");
      } finally {
        setLoading(false);
      }
    };

    if (id) getRoom();
  }, [id]);

  const handleConfirmBooking = async () => {
    if (!room) return;

  try {
  setBookingLoading(true);

  const bookingQuery = query(
    collection(db, "bookings"),
    where("roomId", "==", room.id),
    where("checkIn", "==", checkIn),
    where("checkOut", "==", checkOut),
    where("status", "in", ["pending", "paid"])
  );

  const bookingSnapshot = await getDocs(bookingQuery);

  if (!bookingSnapshot.empty) {
    toast.error("This room is already booked for the selected dates");
    return;
  }

  await addDoc(collection(db, "bookings"), {
  userId: auth.currentUser?.uid,
  roomId: room.id,
  roomName: room.name,
  roomImage: room.image,
  price: room.price,
  nights,
  totalPrice: room.price * nights,
  fullName,
  email,
  phone,
  checkIn,
  checkOut,
  status: "pending",
  paymentStatus: "unpaid",
  createdAt: new Date(),
});

  toast.success("Booking created successfully!");
  router.push("/myreservation");
  } catch (error) {
  console.error(error);
  toast.error("Failed to create booking");
  } finally {
  setBookingLoading(false);
 }
  };

  if (loading) {
    return <p>Loading checkout...</p>;
  }

  if (!room) {
    return <p>Room not found.</p>;
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-white rounded-xl shadow-sm p-5">
        <h1 className="text-3xl font-bold mb-6">
          Checkout
        </h1>

        <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6">
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold">
          {room.name}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-gray-500 text-sm">
              Full Name
            </p>
            <p className="font-semibold">
              {fullName}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Email
            </p>
            <p className="font-semibold">
              {email}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Phone
            </p>
            <p className="font-semibold">
              {phone}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Nights
            </p>
            <p className="font-semibold">
              {nights} night(s)
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Check In
            </p>
            <p className="font-semibold">
              {checkIn
                ? new Date(checkIn).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Check Out
            </p>
            <p className="font-semibold">
              {checkOut
                ? new Date(checkOut).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
          <h2 className="text-2xl font-bold mb-5">
            Payment Summary
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Price / night</span>
              <span>
                Rp {room.price.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total nights</span>
              <span>{nights}</span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>
                Rp {(room.price * nights).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={bookingLoading}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold disabled:opacity-50"
          >
            {bookingLoading
              ? "Processing..."
              : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetail;