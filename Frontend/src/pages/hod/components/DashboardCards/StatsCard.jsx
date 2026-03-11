
import { useState } from "react";

export default function StatsCard({
  title,
  value,
  change,
  changeColor,
  icon,
  iconBg,
  hoverRing, // example: ring-blue-400
  darkMode,
  clickColorBg, // e.g. 'bg-blue-200' for Total Students
  clickIconColor, // e.g. 'text-blue-400'
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200); // 200ms blink
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group cursor-pointer rounded-xl p-5 border
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-lg
        hover:ring-2 ${hoverRing}
        ${clicked
          ? `${clickColorBg} ${darkMode ? "text-gray-100" : "text-gray-900"}`
          : darkMode
          ? "bg-gray-800 text-gray-100 border-gray-700"
          : "bg-white text-gray-900 border-gray-200"}
      `}
    >
      {/* Top Row */}
      <div className="flex justify-between items-center">
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {title}
        </p>

        <div
          className={`
            p-3 rounded-xl
            transition-all duration-300
            group-hover:scale-110
            ${clicked ? clickIconColor : iconBg}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <h2 className="text-2xl font-bold mt-3">
        {value}
      </h2>

      {/* Change */}
      <p className={`text-sm mt-1 ${changeColor}`}>
        {change}
      </p>
    </div>
  );
}
