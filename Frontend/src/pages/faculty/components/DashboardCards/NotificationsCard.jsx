// components/FacultyDashboardCards/NotificationsCard.jsx
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow space-y-4">
      <h2 className="text-lg font-semibold">Recent Notifications</h2>

      <NotificationItem
        icon={<Bell className="text-orange-500" />}
        text="5 pending leave approvals require your attention"
        time="2 hours ago"
        badge="Action Required"
      />

      <NotificationItem
        icon={<Bell className="text-blue-500" />}
        text="12 assignments have been submitted and need review"
        time="3 hours ago"
        badge="Info"
      />

      <NotificationItem
        icon={<Bell className="text-red-500" />}
        text="Check CGPA trends for CS-3A – 3 students declining"
        time="5 hours ago"
        badge="Info"
      />

      <NotificationItem
        icon={<Bell className="text-blue-500" />}
        text="Attendance for today's class has been marked"
        time="1 day ago"
        badge="Info"
      />
    </div>
  );
}
