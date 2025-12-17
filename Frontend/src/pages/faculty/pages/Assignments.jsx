
import { useState, useMemo } from "react";

import AssignmentStatCard from "../components/AssignmentCards/AssignmentStatCard";
import AssignmentFilterCard from "../components/AssignmentCards/AssignmentFilterCard";
import AssignmentTable from "../components/AssignmentCards/AssignmentTable";

export default function Assignments() {
  const [section, setSection] = useState("All Sections");
  const [status, setStatus] = useState("All Status");

  const assignments = [
    {
      name: "Alice Johnson",
      id: "CS001",
      assignment: "Data Structures Lab 5",
      section: "CS-3A",
      date: "2025-12-10",
      status: "Graded",
      grade: "A"
    },
    {
      name: "Bob Smith",
      id: "CS002",
      assignment: "Algorithm Analysis Report",
      section: "CS-3A",
      date: "2025-12-11",
      status: "Submitted",
      grade: ""
    },
    {
      name: "David Brown",
      id: "CS004",
      assignment: "Algorithm Analysis Report",
      section: "CS-3B",
      date: "",
      status: "Pending",
      grade: ""
    }
  ];

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      return (
        (section === "All Sections" || a.section === section) &&
        (status === "All Status" || a.status === status)
      );
    });
  }, [section, status]);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Assignments</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AssignmentStatCard title="Pending Submissions" value={12} type="pending" />
        <AssignmentStatCard title="Submitted" value={45} type="submitted" />
        <AssignmentStatCard title="Graded" value={38} type="graded" />
      </div>

      {/* FILTER */}
      <AssignmentFilterCard
        section={section}
        setSection={setSection}
        status={status}
        setStatus={setStatus}
      />

      {/* TABLE */}
      <AssignmentTable assignments={filtered} />
    </div>
  );
}
