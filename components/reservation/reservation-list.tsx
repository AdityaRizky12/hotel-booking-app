"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import PaymentButton from "@/components/reservation/payment-button";
import { db } from "@/firebase/firebase.config";
import { toast } from "react-toastify";
import { where } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";

type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt?: any;
};

const ReservationList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState("");
  const { user } = useAuth();

  useEffect(() => {
  const getBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  getBookings();
   }, [user]);

  const handlePayment = async (bookingId: string) => {
    try {
      setPayingId(bookingId);

      await updateDoc(doc(db, "bookings", bookingId), {
        status: "paid",
        paymentStatus: "paid",
        paidAt: new Date(),
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "paid",
                paymentStatus: "paid",
              }
            : booking
        )
      );

      toast.success("Payment successful!");
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    } finally {
      setPayingId("");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
  const confirmCancel = window.confirm("Cancel this booking?");

  if (!confirmCancel) return;

  try {
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "cancelled",
      paymentStatus: "cancelled",
      cancelledAt: new Date(),
    });

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "cancelled",
              paymentStatus: "cancelled",
            }
          : booking
      )
    );

    toast.success("Booking cancelled successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to cancel booking");
  }
};

  const getStatusLabel = (booking: Booking) => {
    const today = new Date();
    const checkOutDate = new Date(booking.checkOut);

    if (booking.status === "paid" && checkOutDate < today) {
      return "Completed";
    }

    if (booking.status === "paid") {
      return "Paid";
    }

    if (booking.status === "pending") {
      return "Pending Payment";
    }

    return booking.status;
  };

  const getStatusClass = (booking: Booking) => {
    const label = getStatusLabel(booking);

    if (label === "Paid") {
      return "bg-green-50 text-green-600";
    }

    if (label === "Completed") {
      return "bg-blue-50 text-blue-600";
    }

    if (label === "Pending Payment") {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-gray-50 text-gray-600";
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <p className="text-gray-500">Loading reservations...</p>;
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          No Reservations Yet
        </h2>
        <p className="text-gray-500 mt-2">
          You don&apos;t have any reservations at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* IMAGE */}
            <div className="md:col-span-3 relative h-56 md:h-full min-h-[180px]">
              <Image
                src={booking.roomImage}
                alt={booking.roomName}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="md:col-span-6 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {booking.roomName}
                </h2>

                <span
                  className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                    booking
                  )}`}
                >
                  {getStatusLabel(booking)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-sm">
                <div>
                  <p className="text-gray-400">Guest Name</p>
                  <p className="font-semibold text-gray-800">
                    {booking.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-800">
                    {booking.phone}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Check In</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(booking.checkIn)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Check Out</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(booking.checkOut)}
                  </p>
                </div>
              </div>
            </div>

            {/* PRICE + ACTION */}
            <div className="md:col-span-3 p-5 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Payment</p>
                <p className="text-2xl font-bold text-orange-500 mt-1">
                  Rp {booking.totalPrice?.toLocaleString("id-ID")}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {booking.nights} night(s)
                </p>
              </div>

           {booking.status === "pending" ? (
  <div className="space-y-3">
    <PaymentButton booking={booking} />

    <button
      type="button"
      onClick={() => handleCancelBooking(booking.id)}
      className="w-full border border-red-200 text-red-600 py-3 rounded-md font-semibold hover:bg-red-50"
    >
      Cancel Booking
    </button>
  </div>
) : booking.status === "cancelled" ? (
  <button
    type="button"
    disabled
    className="mt-5 w-full bg-red-50 text-red-500 py-3 rounded-md font-semibold cursor-not-allowed"
  >
    Booking Cancelled
  </button>
) : (
  <button
    type="button"
    disabled
    className="mt-5 w-full bg-gray-100 text-gray-500 py-3 rounded-md font-semibold cursor-not-allowed"
  >
    Payment Completed
  </button>
)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;