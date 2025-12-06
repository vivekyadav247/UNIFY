
import React, { useState } from "react";
import StatsCard from "../components/Feedback/StatsCard";
import FeedbackTabs from "../components/Feedback/FeedbackTabs";
import FeedbackList from "../components/Feedback/FeedbackList";
import SummaryCard from "../components/Feedback/SummaryCard";

export default function Feedback() {
  const [active, setActive] = useState("all");

  const stats = [
    { title: "Total Feedback", value: "6" },
    { title: "Academic", value: "3" },
    { title: "Mentorship", value: "2" },
    { title: "Avg Rating", value: "4.7/5.0" }
  ];

  const feedbackData = [
    {
      initials: "PMC",
      name: "Prof. Michael Chen",
      role: "Teacher Guardian",
      date: "January 15, 2025",
      course: "Data Structures",
      rating: 5,
      tag: "academic",
      message:
        "Excellent performance in Data Structures. Your understanding of tree traversal algorithms is commendable. Keep up the good work!"
    },
    {
      initials: "PMC",
      name: "Prof. Michael Chen",
      role: "Teacher Guardian",
      date: "January 14, 2025",
      tag: "mentorship",
      message:
        "Great to see your consistent performance. However, please focus on time management to balance coursework and extracurricular activities."
    },
    {
      initials: "DSM",
      name: "Dr. Sarah Miller",
      role: "Subject Professor",
      date: "January 12, 2025",
      course: "DBMS",
      rating: 4,
      tag: "academic",
      message:
        "Good progress in database concepts. Focus more on normalization techniques for better understanding."
    },
    {
      initials: "DEB",
      name: "Dr. Emily Brown",
      role: "Class Coordinator",
      date: "January 10, 2025",
      tag: "behavioral",
      message:
        "Excellent classroom participation and positive attitude. Your collaboration with peers is exemplary."
    },
    {
      initials: "PJW",
      name: "Prof. James Wilson",
      role: "Lab Instructor",
      date: "January 8, 2025",
      course: "Operating Systems",
      rating: 5,
      tag: "academic",
      message:
        "Outstanding lab work. Your process scheduling implementation was perfect. Great job!"
    }
  ];

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800">Feedback</h1>
      <p className="text-gray-500">Welcome back, Emma Williams</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5 mt-6">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>

      {/* Tabs */}
      <FeedbackTabs active={active} setActive={setActive} />

      {/* Feedback List */}
      <FeedbackList data={feedbackData} active={active} />

      {/* Summary */}
      <SummaryCard
        text="Your consistent performance and positive attitude have been highly appreciated by your mentors. Continue to maintain your academic excellence while also focusing on time management and extracurricular participation for holistic development."
      />
    </div>
  );
}
