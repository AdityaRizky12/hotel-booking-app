import Link from "next/link";
import { IoCloseCircleOutline } from "react-icons/io5";

const PaymentFailedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full text-center p-8 rounded-xl shadow-sm">
        <IoCloseCircleOutline className="size-20 text-red-500 mx-auto" />

        <h1 className="text-3xl font-bold mt-4">Payment Failed</h1>

        <p className="text-gray-500 mt-3">
          Your payment could not be completed. Please try again.
        </p>

        <Link
          href="/myreservation"
          className="block mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold"
        >
          Back to My Reservation
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;