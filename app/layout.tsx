import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/app/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Script from "next/script";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "Booking Hotel Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">

    <Script
  src={
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js"
  }
  data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
  strategy="afterInteractive"
/>
        {/* 🔥 INI YANG KAMU TAMBAH */}
       <AuthProvider>

  <ProtectedRoute>

    <Navbar />

    <main className="bg-gray-50 min-h-screen">
      {children}
    </main>

    <Footer />

  </ProtectedRoute>

  <ToastContainer />

</AuthProvider>

      </body>
    </html>
  );
}