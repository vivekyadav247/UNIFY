
import React from "react";
import AssignmentCard from "./AssignmentCard";

/**
 * props:
 *  items: array of assignment objects
 *  onSubmitFile: (id, file) => {}
 */
export default function AssignmentsList({ items = [], onSubmitFile }) {
  if (!items.length) {
    return <p className="text-gray-500 py-6">No assignments to show.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((a) => (
        <AssignmentCard key={a.id} data={a} onSubmitFile={onSubmitFile} />
      ))}
    </div>
  );
}
