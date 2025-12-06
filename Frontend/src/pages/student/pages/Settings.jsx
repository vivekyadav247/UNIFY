import ProfileCard from "../components/Settings/ProfileCard";
import SecurityCard from "../components/Settings/SecurityCard";
import NotificationsCard from "../components/Settings/NotificationsCard";
import AppearanceCard from "../components/Settings/AppearanceCard";
import DangerZoneCard from "../components/Settings/DangerZoneCard";

export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-gray-600 mb-6">Welcome back, Emma Williams</p>

      <ProfileCard />
      <SecurityCard />
      <NotificationsCard />
      <AppearanceCard />
      <DangerZoneCard />
    </div>
  );
}
