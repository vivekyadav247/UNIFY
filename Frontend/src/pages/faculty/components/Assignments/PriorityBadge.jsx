
import React from "react";

/**
 * type: "high" | "medium" | "low"
 */
export default function PriorityBadge({ type = "low" }) {
  const styles = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      {type} priority
    </span>
  );
}
