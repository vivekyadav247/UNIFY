import { useOutletContext } from "react-router-dom";
import StatsSection from "../components/DashboardCards/StatsSection";
import NotificationsCard from "../components/DashboardCards/NotificationsCard";

export default function FacultyDashboard() {
  const { darkMode } = useOutletContext();

  return (
    <div
      className={`p-6 space-y-8 min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-slate-100"
      }`}
    >
      <StatsSection />
      <NotificationsCard />
    </div>
  );
}
