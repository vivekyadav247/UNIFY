
import React from "react";
import { MessageSquare } from "lucide-react";

export default function SummaryCard({ text }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 shadow-sm mt-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white rounded-xl shadow">
          <MessageSquare className="text-blue-600" size={20} />
        </div>
        <h3 className="font-semibold text-gray-800 text-lg">
          Overall Performance Summary
        </h3>
      </div>

      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
