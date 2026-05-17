import ReservationList from "@/components/reservation/reservation-list";

const MyReservationPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold mb-6">My Reservation</h1>
      <ReservationList />
    </div>
  );
};

export default MyReservationPage;