import React from "react";

export default function GradeBreakdownCard({ distribution, darkMode }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div className={`p-6 rounded-2xl transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-800/50 border border-gray-700" 
        : "bg-white border border-gray-200"
    }`}>
      
      <div className="space-y-4">
        {Object.entries(distribution).map(([grade, count]) => {
          const percentage = Math.round((count / total) * 100);
          
          const gradeColors = {
            "A+": { bar: "bg-green-500", badge: darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700" },
            "A": { bar: "bg-blue-500", badge: darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700" },
            "B+": { bar: "bg-yellow-500", badge: darkMode ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-700" },
            "B": { bar: "bg-orange-500", badge: darkMode ? "bg-orange-900/50 text-orange-300" : "bg-orange-100 text-orange-700" },
          };

          const colors = gradeColors[grade];

          return (
            <div key={grade}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Grade {grade}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${colors.badge}`}>
                  {count} ({percentage}%)
                </span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
                <div 
                  className={`h-full transition-all duration-300 ${colors.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}