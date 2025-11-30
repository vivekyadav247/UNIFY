
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // Theme state
  const [theme, setTheme] = useState("light");

  // Persist theme in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  // Notification state
  const [notifications, setNotifications] = useState(3);

  return (
    <div
      data-theme={theme}
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <BrowserRouter>
        <AppRoutes
          toggleTheme={toggleTheme}
          currentTheme={theme}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
