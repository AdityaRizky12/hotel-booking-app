"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import {
  IoBedOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

type Booking = {
  id: string;
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
  paymentStatus?: "unpaid" | "paid";
  createdAt?: any;
};

const DashboardOverview = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
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
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  const getRealStatus = (booking: Booking) => {
    const today = new Date();
    const checkOutDate = new Date(booking.checkOut);

    if (booking.status === "paid" && checkOutDate < today) {
      return "completed";
    }

    return booking.status;
  };

  const stats = useMemo(() => {
    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
      (booking) => getRealStatus(booking) === "pending"
    ).length;

    const activeBookings = bookings.filter(
      (booking) => getRealStatus(booking) === "paid"
    ).length;

    const completedBookings = bookings.filter(
      (booking) => getRealStatus(booking) === "completed"
    ).length;

    const totalRevenue = bookings
      .filter((booking) =>
        ["paid", "completed"].includes(getRealStatus(booking))
      )
      .reduce((total, booking) => total + Number(booking.totalPrice || 0), 0);

    return {
      totalBookings,
      pendingBookings,
      activeBookings,
      completedBookings,
      totalRevenue,
    };
  }, [bookings]);

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusLabel = (status: string) => {
    if (status === "pending") return "Pending Payment";
    if (status === "paid") return "Active / Paid";
    if (status === "completed") return "Completed";
    return status;
  };

  const statusClass = (status: string) => {
    if (status === "pending") return "bg-yellow-50 text-yellow-700";
    if (status === "paid") return "bg-green-50 text-green-600";
    if (status === "completed") return "bg-blue-50 text-blue-600";
    return "bg-gray-50 text-gray-600";
  };

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats.totalBookings}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <IoBedOutline className="size-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payment</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats.pendingBookings}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <IoTimeOutline className="size-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active / Paid</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats.activeBookings}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <IoCheckmarkCircleOutline className="size-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats.completedBookings}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <IoCheckmarkCircleOutline className="size-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sm:col-span-2 xl:col-span-1">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-2xl font-bold mt-2 text-orange-500">
              Rp {stats.totalRevenue.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold">Recent Bookings</h2>
          <p className="text-gray-500 text-sm mt-1">
            Latest hotel reservations from customers.
          </p>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                  Room
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                  Guest
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const status = getRealStatus(booking);

                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={booking.roomImage}
                          alt={booking.roomName}
                          width={64}
                          height={48}
                          className="w-16 h-12 rounded-md object-cover"
                        />
                        <p className="font-semibold text-gray-800">
                          {booking.roomName}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {booking.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(booking.checkIn)} -{" "}
                      {formatDate(booking.checkOut)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      Rp {booking.totalPrice?.toLocaleString("id-ID")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${statusClass(
                          status
                        )}`}
                      >
                        {statusLabel(status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100">
          {bookings.map((booking) => {
            const status = getRealStatus(booking);

            return (
              <div key={booking.id} className="p-5">
                <div className="flex gap-4">
                  <Image
                    src={booking.roomImage}
                    alt={booking.roomName}
                    width={96}
                    height={80}
                    className="w-24 h-20 rounded-md object-cover flex-none"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {booking.roomName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.fullName}
                    </p>
                    <span
                      className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                        status
                      )}`}
                    >
                      {statusLabel(status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div>
                    <p className="text-gray-400">Check In</p>
                    <p className="font-semibold">
                      {formatDate(booking.checkIn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Check Out</p>
                    <p className="font-semibold">
                      {formatDate(booking.checkOut)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-gray-400">Total</p>
                    <p className="font-bold text-orange-500">
                      Rp {booking.totalPrice?.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {bookings.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;