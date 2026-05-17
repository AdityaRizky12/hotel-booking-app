import DashboardOverview from "@/components/admin/dashboard/dashboard-overview";

const AdminDashboardPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-3">
        Admin Dashboard
      </h1>

      <p className="text-gray-500 mb-8">
        Monitor hotel bookings, revenue, and reservation status.
      </p>

      <DashboardOverview />
    </div>
  );
};

export default AdminDashboardPage;