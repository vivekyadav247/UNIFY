
import React from "react";
import StatsCard from "../../faculty/components/MarksCards/StatsCard";
import SubjectBarChart from "../../faculty/components/MarksCards/SubjectBarChart";
import RadarChart from "../../faculty/components/MarksCards/RadarChart";
import SemesterProgress from "../../faculty/components/MarksCards/SemesterProgress";
import MarksBreakdown from "../../faculty/components/MarksCards/MarksBreakdown";
import SummaryCard from "../../faculty/components/MarksCards/SummaryCard";

export default function Marks() {
  // mock (replace with API)
  const stats = { 
    overall: "82.2%", 
    total: "737 / 900", 
    highest: "88.7% (DSA)", 
    rank: "8 / 120" 
  };

  const labels = ["Math", "Physics", "DSA", "DBMS", "OS"];
  const internal = [42, 38, 46, 36, 43];
  const external = [85, 78, 90, 82, 80];
  const radarVals = [84, 76, 88, 82, 79, 86];

  const semesterLabels = ["Internal 1", "Internal 2", "Internal 3", "Prelims"];
  const semesterVals = [88, 90, 92, 91];

  const subjects = [
    { name: "Mathematics", internalObtained: 42, internalMax: 50, externalObtained: 85, externalMax: 100, totalObtained: 127, totalMax: 150, grade: "A" },
    { name: "Physics", internalObtained: 38, internalMax: 50, externalObtained: 78, externalMax: 100, totalObtained: 116, totalMax: 150, grade: "B+" },
    { name: "Data Structures", internalObtained: 45, internalMax: 50, externalObtained: 90, externalMax: 100, totalObtained: 135, totalMax: 150, grade: "A+" },
    { name: "Operating Systems", internalObtained: 43, internalMax: 50, externalObtained: 80, externalMax: 100, totalObtained: 123, totalMax: 150, grade: "A" },
    { name: "Computer Networks", internalObtained: 44, internalMax: 50, externalObtained: 82, externalMax: 100, totalObtained: 126, totalMax: 150, grade: "A" },
  ];

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <StatsCard stats={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectBarChart labels={labels} internal={internal} external={external} />
        <RadarChart labels={["Math", "Physics", "Data", "DBMS", "OS"]} values={radarVals} />
      </div>

      {/* Semester Progress */}
      <SemesterProgress labels={semesterLabels} values={semesterVals} />

      {/* Marks Breakdown */}
      <MarksBreakdown subjects={subjects} />

      {/* Summary */}
      <SummaryCard />
    </div>
  );
}
