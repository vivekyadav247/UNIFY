
// pages/faculty/pages/FacultyDashboard.jsx

import StatsSection from "../components/DashboardCards/StatsSection";
import NotificationsCard from "../components/DashboardCards/NotificationsCard";

export default function FacultyDashboard() {
  return (
    <div className="p-6 space-y-8 bg-slate-100 min-h-screen">
      <StatsSection />
      <NotificationsCard />
    </div>
  );
}
