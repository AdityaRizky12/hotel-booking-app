"use client";

import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const Navlink = () => {
  const [open, setOpen] = useState(false);
  const { user, userData, role, logout } = useAuth()
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center p-2 justify-center text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100"
      >
        {!open ? <IoMenu className="size-8" /> : <IoClose className="size-8" />}
      </button>

      <div
        className={clsx("w-full md:block md:w-auto", {
          hidden: !open,
        })}
      >
        <ul className="flex flex-col font-semibold text-sm uppercase p-4 mt-4 rounded-sm bg-gray-50 md:flex-row md:items-center md:space-x-10 md:p-0 md:mt-0 md:border-0 md:bg-white">

          <li>
            <Link href="/" className="block py-2 px-3 text-gray-500 hover:bg-gray-100 md:p-0">
              Home
            </Link>
          </li>

          <li>
            <Link href="/about" className="block py-2 px-3 text-gray-500 hover:bg-gray-100 md:p-0">
              About
            </Link>
          </li>

          <li>
            <Link href="/room" className="block py-2 px-3 text-gray-500 hover:bg-gray-100 md:p-0">
              Rooms
            </Link>
          </li>

          <li>
            <Link href="/contact" className="block py-2 px-3 text-gray-500 hover:bg-gray-100 md:p-0">
              Contact
            </Link>
          </li>

          <li>
            <Link href="/myreservation" className="block py-2 px-3 text-gray-500 hover:bg-gray-100 md:p-0">
              My Reservation
            </Link>
          </li>

          {/* ADMIN MENU */}
        {/* ADMIN MENU */}
{role === "admin" && (
  <>
    {/* Divider khusus mobile */}
    <li className="border-t mt-3 pt-3 md:hidden text-xs text-gray-400">
      ADMIN MENU
    </li>

    <li>
      <Link
        href="/admin/dashboard"
        className="block py-2 px-3 text-blue-600 hover:bg-blue-50 md:hover:bg-transparent md:p-0"
      >
        Dashboard
      </Link>
    </li>

    <li>
      <Link
        href="/admin/room"
        className="block py-2 px-3 text-blue-600 hover:bg-blue-50 md:hover:bg-transparent md:p-0"
      >
        Manage Room
      </Link>
    </li>

    <li>
      <Link
        href="/admin/contact"
        className="block py-2 px-3 text-blue-600 hover:bg-blue-50 md:hover:bg-transparent md:p-0"
      >
        Contact Messages
      </Link>
    </li>
  </>
)}

          {/* USER LOGIN STATE */}
          {user ? (
            <li className="flex items-center gap-3">

              {/* Avatar */}
                <img
  src={`https://ui-avatars.com/api/?name=${
    userData?.name || user?.displayName || "User"
  }&background=random&color=fff`}
  className="w-8 h-8 rounded-full"
  alt="avatar"
/>
              {/* Name */}
            <span className="text-gray-700">
      {userData?.name ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
        "User"}
     </span>

              {/* Logout */}
             <button
  onClick={async () => {
    await logout();
    router.push("/");
  }}
  className="text-red-500"
>
  Logout
</button>
            </li>
          ) : (
            <li className="pt-2 md:pt-0">
              <Link
                href="/signin"
                className="py-2.5 px-6 bg-orange-400 text-white hover:bg-orange-500 rounded-s-2xl"
              >
                Sign In
              </Link>
            </li>
          )}

        </ul>
      </div>
    </>
  );
};

export default Navlink;