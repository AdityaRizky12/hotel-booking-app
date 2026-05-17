"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { useParams } from "next/navigation";
import {
  IoCheckmarkCircleOutline,
  IoDownloadOutline,
  IoQrCodeOutline,
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
  status: string;
  paymentStatus: string;
  paidAt?: any;
};

const PaymentReceipt = () => {
  const { id } = useParams();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBooking = async () => {
      try {
        const docRef = doc(db, "bookings", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBooking({
            id: docSnap.id,
            ...docSnap.data(),
          } as Booking);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };

    if (id) getBooking();
  }, [id]);

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPaidAt = (paidAt: any) => {
    if (!paidAt) return "-";

    const date = paidAt?.toDate ? paidAt.toDate() : new Date(paidAt);

    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

 const handleDownload = () => {
  document.body.classList.add("print-receipt-mode");

  window.print();

  setTimeout(() => {
    document.body.classList.remove("print-receipt-mode");
  }, 1000);
  };
  if (loading) return <p>Loading receipt...</p>;
  if (!booking) return <p>Receipt not found.</p>;

  return (
    <div>
     <div
  id="booking-receipt"
  ref={receiptRef}
  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Receipt
            </h1>

            <p className="text-gray-500 mt-1">
              Booking ID: #{booking.id}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 text-gray-600">
              <IoQrCodeOutline className="size-5" />

              <span className="text-sm font-medium">
                QR Code: {booking.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-semibold w-fit">
            <IoCheckmarkCircleOutline className="size-5" />
            Paid Success
          </div>
        </div>

        {/* BODY */}
        <div className="grid md:grid-cols-12 gap-0">
          <div className="md:col-span-5 relative h-72 md:h-auto min-h-[300px]">
            <Image
              src={booking.roomImage}
              alt={booking.roomName}
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-7 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {booking.roomName}
            </h2>

            <div className="grid sm:grid-cols-2 gap-5 mt-6">
              <div>
                <p className="text-sm text-gray-400">Guest Name</p>
                <p className="font-semibold">{booking.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-semibold break-words">
                  {booking.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="font-semibold">{booking.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Nights</p>
                <p className="font-semibold">{booking.nights} night(s)</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Check In</p>
                <p className="font-semibold">{formatDate(booking.checkIn)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Check Out</p>
                <p className="font-semibold">{formatDate(booking.checkOut)}</p>
              </div>
            </div>

            {/* PAYMENT INFO */}
            <div className="mt-8 border-t border-dashed border-gray-200 pt-6">
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <p className="text-sm text-gray-400">Payment Method</p>
                  <p className="font-semibold">Midtrans Sandbox</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Paid At</p>
                  <p className="font-semibold">{formatPaidAt(booking.paidAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Reservation Status</p>
                  <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-semibold">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-gray-500">Total Payment</span>

              <span className="text-3xl font-bold text-orange-500">
                Rp {booking.totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 md:p-8 border-t border-gray-100 text-center">
          <p className="text-gray-500">
            Thank you for choosing our hotel. We look forward to welcoming you.
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
     <div className="no-print flex flex-col md:flex-row gap-3 mt-6">
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold"
        >
          <IoDownloadOutline className="size-5" />
          Print / Save PDF
        </button>

        <Link
          href="/myreservation"
          className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-50"
        >
          Back to My Reservation
        </Link>
      </div>
    </div>
  );
};

export default PaymentReceipt;