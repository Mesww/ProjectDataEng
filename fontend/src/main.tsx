import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./pages/UserPage/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage"; // for 404 page
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<HomePage onLogout={handleLogout} />} />
        </Route>

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// Render the App
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
