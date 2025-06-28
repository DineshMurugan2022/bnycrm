import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

import Monitoring from "./pages/Monitoring";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Team from "./pages/Team";
import Index from "./pages/Index";
import Call from "./Call";
import Apointment from "./Apointment";
import BDM from "./BDM";
import Livelocation from "./Livelocation";
import Login from "./pages/Login";
import ProtectedLayout from "./user/ProtectedLayout";

// Helper to get user group from token
const getUserGroupFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token); // ✅ Correct usage
    return decoded.userGroup;
  } catch {
    return null;
  }
};

// Route protection component
const RequireRole = ({ allowedRoles, children }) => {
  const userGroup = getUserGroupFromToken();
  return allowedRoles.includes(userGroup) ? children : <Navigate to="/team" replace />;
};

const App = () => {
  const [auth, setAuth] = useState(() => {
    const userGroup = getUserGroupFromToken();
    return {
      isLoggedIn: !!userGroup,
      role: userGroup,
    };
  });

  const userGroup = auth.role;
  const showNavbar = !["user", "bdm"].includes(userGroup);

  return (
    <Routes>
      <Route path="/login" element={<Login setAuth={setAuth} />} />
      <Route
        path="/"
        element={
          userGroup ? <Navigate to="/login" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/index"
        element={
          <ProtectedLayout showNavbar={showNavbar}>
            <Index />
          </ProtectedLayout>
        }
      />

      <Route
        path="/monitoring"
        element={
          <RequireRole allowedRoles={["admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Monitoring />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/leads"
        element={
          <RequireRole allowedRoles={["admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Leads />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/tasks"
        element={
          <RequireRole allowedRoles={["admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Tasks />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/calendar"
        element={
          <RequireRole allowedRoles={["admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Calendar />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/reports"
        element={
          <RequireRole allowedRoles={["admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Reports />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/team"
        element={
          <RequireRole allowedRoles={["admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Team />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/appointment"
        element={
          <RequireRole allowedRoles={["admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Apointment />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/call"
        element={
          <RequireRole allowedRoles={["user", "admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Call />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/livelocation"
        element={
          <RequireRole allowedRoles={["user", "admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <Livelocation />
            </ProtectedLayout>
          </RequireRole>
        }
      />

      <Route
        path="/bdm"
        element={
          <RequireRole allowedRoles={["bdm", "admin", "teamleader"]}>
            <ProtectedLayout showNavbar={showNavbar}>
              <BDM />
            </ProtectedLayout>
          </RequireRole>
        }
      />
    </Routes>
  );
};

export default App;
