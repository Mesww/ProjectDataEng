import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({
  isAuthenticated,
  userRole,
  requiredRole,
}: {
  isAuthenticated: boolean;
  userRole: string | null;
  requiredRole: string;
}) => {
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to /user (or a custom access-denied page) if role doesn't match
    return <Navigate to="/user" />;
  }

  return <Outlet />; // Render child routes if authenticated and authorized
};

export default PrivateRoute;
