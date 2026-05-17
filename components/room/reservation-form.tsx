"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";

type Props = {
  room: {
    id: string;
    price: number;
  };
};

const ReservationForm = ({ room }: Props) => {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      alert("Please select check in and check out");
      return;
    }

    const query = new URLSearchParams({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    });

    router.push(
      `/rooms/${room.id}/checkout?${query.toString()}`
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <h2 className="text-2xl font-bold mb-5">
        Reservation
      </h2>

      <form onSubmit={handleSubmit}>
        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
          />
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Phone Number
          </label>

          <input
            type="text"
            placeholder="+62..."
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
          />
        </div>

        {/* CHECK IN */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Check In
          </label>

          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            minDate={new Date()}
            placeholderText="Select check in"
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
          />
        </div>

        {/* CHECK OUT */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Check Out
          </label>

          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            minDate={checkIn || new Date()}
            placeholderText="Select check out"
            className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-400"
          />
        </div>

        {/* PRICE */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-gray-600">
            Price / night
          </span>

          <span className="text-xl font-bold text-orange-500">
            Rp {room.price.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold transition"
        >
          Reserve Now
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;