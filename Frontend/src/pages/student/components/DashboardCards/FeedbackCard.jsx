
import React from "react";

export default function FeedbackCard({ items }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Feedback from Teacher Guardian</h3>

      <div className="space-y-4">
        {items.map((f, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{f.by}</p>
                <p className="text-xs text-slate-400">{f.date}</p>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                {f.tag}
              </span>
            </div>

            <p className="text-sm mt-2">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
