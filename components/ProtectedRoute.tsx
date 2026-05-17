"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const publicRoutes = ["/signin"];

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const { user, loading } = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {

    if (
      !loading &&
      !user &&
      !isPublicRoute
    ) {
      router.push("/signin");
    }

  }, [user, loading, isPublicRoute, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // ✅ PUBLIC PAGE BOLEH RENDER
  if (!user && isPublicRoute) {
    return <>{children}</>;
  }

  // ✅ protected page tunggu redirect
  if (!user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;