
import LeaveStatCards from "../components/LeaveCards/LeaveStatCards";
import ApplyLeaveCard from "../components/LeaveCards/ApplyLeaveCard";
import LeaveHistoryTable from "../components/LeaveCards/LeaveHistoryTable";

export default function LeaveManagement() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold">Leave Management</h1>

      <LeaveStatCards />

      <ApplyLeaveCard />

      <LeaveHistoryTable />
    </div>
  );
}
