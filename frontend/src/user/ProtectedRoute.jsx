import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("userGroup");

  return allowedRoles.includes(role) ? children : <Navigate to="/unauthorized" />;
}
