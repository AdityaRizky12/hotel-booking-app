"use client";

import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  fullName: string;
  email: string;
  phone: string;
  totalPrice: number;
};

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const PaymentButton = ({ booking }: { booking: Booking }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isSnapOpen, setIsSnapOpen] = useState(false);

  const handlePayment = async () => {
    if (loading || isSnapOpen) return;

    try {
      setLoading(true);

      const response = await fetch("/api/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to create payment");
        return;
      }

      if (!window.snap) {
        toast.error("Midtrans Snap is not loaded");
        return;
      }

      setIsSnapOpen(true);

      window.snap.pay(data.token, {
        onSuccess: async () => {
          try {
            await updateDoc(doc(db, "bookings", booking.id), {
              status: "paid",
              paymentStatus: "paid",
              paidAt: new Date(),
            });

            await fetch("/api/send-receipt", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bookingId: booking.id,
                email: booking.email,
                fullName: booking.fullName,
                roomName: booking.roomName,
                totalPrice: booking.totalPrice,
              }),
            });

            toast.success("Payment successful!");
            router.push(`/payment/success/${booking.id}`);
          } catch (error) {
            console.error(error);
            toast.error("Payment success, but failed to send receipt");
            router.push(`/payment/success/${booking.id}`);
          } finally {
            setIsSnapOpen(false);
          }
        },

        onPending: () => {
          toast.info("Payment is pending");
          setIsSnapOpen(false);
        },

        onError: () => {
          toast.error("Payment failed");
          setIsSnapOpen(false);
          router.push("/payment/failed");
        },

        onClose: () => {
          toast.info("Payment popup closed");
          setIsSnapOpen(false);
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
      router.push("/payment/failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading || isSnapOpen}
      className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold disabled:opacity-50"
    >
      {loading || isSnapOpen ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default PaymentButton;