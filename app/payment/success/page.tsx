import Link from "next/link";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full text-center p-8 rounded-xl shadow-sm">
        <IoCheckmarkCircleOutline className="size-20 text-green-500 mx-auto" />

        <h1 className="text-3xl font-bold mt-4">Payment Successful</h1>

        <p className="text-gray-500 mt-3">
          Your reservation has been paid successfully.
        </p>

        <Link
          href="/myreservation"
          className="block mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold"
        >
          View My Reservation
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;