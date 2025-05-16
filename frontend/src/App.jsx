import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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

import ProtectedLayout from "./components/layout/ProtectedLayout";

const App = () => {
  return (
    <Routes>
      {/* Redirect root path to /Index */}
      <Route path="/" element={<Navigate to="/Index" replace />} />

      {/* Routes wrapped with ProtectedLayout */}
      <Route
        path="/Index"
        element={
          <ProtectedLayout>
            <Index />
          </ProtectedLayout>
        }
      />
      <Route
        path="/Monitoring"
        element={
          <ProtectedLayout>
            <Monitoring />
          </ProtectedLayout>
        }
      />
      <Route
        path="/leads"
        element={
          <ProtectedLayout>
            <Leads />
          </ProtectedLayout>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedLayout>
            <Tasks />
          </ProtectedLayout>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedLayout>
            <Calendar />
          </ProtectedLayout>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedLayout>
            <Reports />
          </ProtectedLayout>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedLayout>
            <Team />
          </ProtectedLayout>
        }
      />
      <Route
        path="/appointment"
        element={
          <ProtectedLayout>
            <Apointment />
          </ProtectedLayout>
        }
      />
      <Route
        path="/livelocation"
        element={
          <ProtectedLayout>
            <Livelocation />
          </ProtectedLayout>
        }
      />
      <Route
        path="/call"
        element={
          <ProtectedLayout>
            <Call />
          </ProtectedLayout>
        }
      />
      <Route
        path="/bdm"
        element={
          <ProtectedLayout>
            <BDM />
          </ProtectedLayout>
        }
      />
    </Routes>
  );
};

export default App;
