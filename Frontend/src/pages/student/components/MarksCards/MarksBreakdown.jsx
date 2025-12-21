import React from "react";

/**
 * Props:
 *  subjects: [
 *    { name, internalObtained, internalMax, externalObtained, externalMax, totalObtained, totalMax, grade }
 *  ]
 *
 * Each subject card has an Upload / Approve button placeholders and a progress bar.
 */
export default function MarksBreakdown({
  subjects = [
    {
      name: "Mathematics",
      internalObtained: 42,
      internalMax: 50,
      externalObtained: 85,
      externalMax: 100,
      totalObtained: 127,
      totalMax: 150,
      grade: "A",
    },
    {
      name: "Physics",
      internalObtained: 38,
      internalMax: 50,
      externalObtained: 78,
      externalMax: 100,
      totalObtained: 116,
      totalMax: 150,
      grade: "B+",
    },
    {
      name: "Data Structures",
      internalObtained: 45,
      internalMax: 50,
      externalObtained: 90,
      externalMax: 100,
      totalObtained: 135,
      totalMax: 150,
      grade: "A+",
    },
  ],
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Detailed Marks Breakdown</h3>

      <div className="space-y-4">
        {subjects.map((s, idx) => {
          const percentage = ((s.totalObtained / s.totalMax) * 100).toFixed(1);
          return (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sky-600">[S]</div>
                    <h4 className="font-semibold">{s.name}</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-slate-700">
                    <div>
                      <div className="text-xs text-slate-400">Internal</div>
                      <div className="font-medium">
                        {s.internalObtained} / {s.internalMax}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">External</div>
                      <div className="font-medium">
                        {s.externalObtained} / {s.externalMax}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">Total</div>
                      <div className="font-medium">
                        {s.totalObtained} / {s.totalMax}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-slate-100">{`Grade: ${s.grade}`}</span>
                </div>
              </div>

              {/* Progress bar row */}
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-black"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right text-sm font-medium">
                  {percentage}%
                </div>
              </div>

              {/* Actions: upload / download / approve (placeholders) */}
              <div className="flex gap-3">
                <button
                  className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
                  onClick={() => alert(`Upload marks file for ${s.name}`)}
                >
                  Upload Marks
                </button>

                <button
                  className="px-3 py-2 rounded border text-sm"
                  onClick={() => alert(`Request re-evaluation for ${s.name}`)}
                >
                  Request Re-eval
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
