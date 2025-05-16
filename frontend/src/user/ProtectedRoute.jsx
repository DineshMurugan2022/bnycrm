import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../user/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Instead of redirecting to unauthorized, redirect to login or homepage or nothing
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
