import { useState } from "react";

export default function QuickActionCard({ darkMode }) {
  const [clickedButton, setClickedButton] = useState(null);

  const handleClick = (button) => {
    setClickedButton(button);
    setTimeout(() => setClickedButton(null), 200);
  };

  const buttons = [
    {
      label: "Generate Report",
      color: "bg-blue-500 text-white hover:bg-blue-600",
      blink: "bg-blue-400",
    },
    {
      label: "Add Event",
      color: "bg-pink-500 text-white hover:bg-pink-600",
      blink: "bg-pink-400",
    },
  ];

  return (
    <div
      className={`rounded-xl p-3 shadow-sm border w-64 mx-auto ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-3 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Quick Actions
      </h3>

      <div className="flex flex-col gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleClick(btn.label)}
            className={`
              w-full py-4 px-5 rounded-2xl font-semibold text-base transition
              ${clickedButton === btn.label ? btn.blink : btn.color}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
