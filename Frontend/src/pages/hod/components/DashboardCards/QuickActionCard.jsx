
import { useState } from "react";

export default function QuickActionCard() {
  const [clickedButton, setClickedButton] = useState(null);

  const handleClick = (button) => {
    setClickedButton(button);
    setTimeout(() => setClickedButton(null), 200); // 200ms blink
  };

  const buttons = [
    {
      label: "Generate Report",
      color: "bg-blue-300 text-white",
      blink: "bg-blue-200",
    },
    {
      label: "Add Event",
      color: "bg-pink-300 text-white",
      blink: "bg-pink-200",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border w-64 mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Actions</h3>

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
