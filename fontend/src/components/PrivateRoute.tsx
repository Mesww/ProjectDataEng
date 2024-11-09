import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // If authenticated, render child routes
};

export default PrivateRoute;
