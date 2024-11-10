import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./pages/UserPage/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage"; // for 404 page
import PrivateRoute from "./components/PrivateRoute";
import HistoryPage from "./pages/UserPage/HistoryPage";
import AdminPage from "./pages/AdminPage/AdminPage"; // Admin page

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null); // Added role state

  const handleLogin = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role); // Set role upon login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Private Routes for users */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="user" />}>
          <Route path="/" element={<HomePage onLogout={handleLogout} />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        {/* Private Routes for admin */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin" />}>
          <Route path="/admin" element={<AdminPage onLogout={handleLogout} />} />
          <Route path="/admin/history" element={<HistoryPage />} />
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
