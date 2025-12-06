
import React, { useState } from "react";
import StatsCard from "../components/Assignments/StatsCard";
import AssignmentTabs from "../components/Assignments/AssignmentsTabs";
import AssignmentList from "../components/Assignments/AssignmentList";

/* Dummy data (matches your screenshots) */
const DUMMY = {
  pending: [
    {
      id: 1,
      title: "Binary Tree Implementation",
      subject: "Data Structures",
      description:
        "Implement a complete binary tree with insertion, deletion, and traversal operations",
      assigned: "10/1/2025",
      due: "20/1/2025",
      maxMarks: 20,
      timeLeft: "2 days",
      priority: "high",
    },
  ],
  submitted: [
    {
      id: 2,
      title: "SQL Query Assignment",
      subject: "DBMS",
      description: "Write complex SQL queries for the given database schema",
      assigned: "12/1/2025",
      due: "22/1/2025",
      maxMarks: 15,
      timeLeft: "4 days",
      priority: "medium",
    },
    {
      id: 3,
      title: "Network Protocol Analysis",
      subject: "Computer Networks",
      description: "Analyze and document various network protocols",
      assigned: "14/1/2025",
      due: "25/1/2025",
      maxMarks: 20,
      timeLeft: "7 days",
      priority: "low",
    },
  ],
};

export default function Assignments() {
  const [active, setActive] = useState("pending");
  const [data, setData] = useState(DUMMY);

  function handleSubmitFile(id, file) {
    // example: mark assignment as submitted when file uploaded for pending item
    // (this is just dummy client-side logic)
    const isPending = data.pending.find((p) => p.id === id);
    if (isPending) {
      const updatedPending = data.pending.filter((p) => p.id !== id);
      const newSubmittedItem = {
        ...isPending,
        timeLeft: "Submitted",
      };
      setData({
        pending: updatedPending,
        submitted: [newSubmittedItem, ...data.submitted],
      });
      alert(`Submitted "${isPending.title}" — file: ${file.name}`);
      setActive("submitted");
    } else {
      alert(`File for assignment id ${id} received: ${file.name}`);
    }
  }

  const stats = [
    { title: "Pending", value: data.pending.length },
    { title: "Submitted", value: data.submitted.length },
    { title: "Graded", value: 6 },
    { title: "Avg Score", value: "87.5%" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800">Assignments</h1>
      <p className="text-gray-500">Manage and submit your assignments</p>

      <div className="grid grid-cols-4 gap-5 mt-6">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>

      <AssignmentTabs
        active={active}
        setActive={setActive}
        counts={{ pending: data.pending.length, submitted: data.submitted.length }}
      />

      <div className="mt-4">
        <AssignmentList
          items={active === "pending" ? data.pending : data.submitted}
          onSubmitFile={handleSubmitFile}
        />
      </div>
    </div>
  );
}
