import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./contexts/NotificationContext";

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

  return (
    <NotificationProvider>
      <div
        data-theme={theme}
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <BrowserRouter>
          <AppRoutes toggleTheme={toggleTheme} currentTheme={theme} />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === "dark" ? "dark" : "light"}
          />
        </BrowserRouter>
      </div>
    </NotificationProvider>
  );
}

export default App;
