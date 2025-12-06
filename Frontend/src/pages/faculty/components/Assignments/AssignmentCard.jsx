
import React from "react";
import { FileText, CalendarIcon } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import SubmitDownloadButtons from "./SubmitDownloadButtons";

/**
 * props.data = {
 *  id, title, subject, description,
 *  assigned, due, maxMarks, timeLeft, priority
 * }
 */
export default function AssignmentCard({ data, onSubmitFile }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative">
      {/* priority */}
      <div className="absolute right-4 top-4">
        <PriorityBadge type={data.priority} />
      </div>

      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
          <FileText size={20} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
          <p className="text-gray-500">{data.subject}</p>

          <p className="mt-4 text-gray-700 leading-relaxed">{data.description}</p>

          <div className="grid grid-cols-4 gap-4 mt-6 text-sm text-gray-700">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarIcon size={16} />
                <span className="text-sm">Assigned</span>
              </div>
              <span className="mt-1 text-gray-800">{data.assigned}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarIcon size={16} />
                <span className="text-sm">Due Date</span>
              </div>
              <span className="mt-1 text-gray-800">{data.due}</span>
            </div>

            <div>
              <div className="text-gray-500 text-sm">Max Marks</div>
              <div className="mt-1 text-gray-800">{data.maxMarks}</div>
            </div>

            <div>
              <div className="text-gray-500 text-sm">Time Left</div>
              <div className={`mt-1 ${data.timeLeft.includes("day") ? "text-red-600" : "text-gray-800"}`}>
                {data.timeLeft}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SubmitDownloadButtons
              onSubmit={(file) => {
                // simple passthrough
                if (onSubmitFile) onSubmitFile(data.id, file);
                else alert(`File selected for "${data.title}": ${file.name}`);
              }}
              downloadFilename={`${data.title.replace(/\s+/g, "_")}.txt`}
              downloadContent={`Assignment: ${data.title}\nSubject: ${data.subject}\nDescription: ${data.description}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
