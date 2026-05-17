"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, role, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {

    if (!loading) {

      // belum login
      if (!user) {
        router.push("/signin");
      }

      // bukan admin
      if (user && role !== "admin") {
        router.push("/");
      }

    }

  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // tunggu redirect
  if (!user || role !== "admin") {
    return null;
  }

  return <>{children}</>;
}