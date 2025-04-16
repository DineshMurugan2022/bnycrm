import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from './pages/Login';
// import Register from './pages/Register';
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Team from "./pages/Team";
import Index from "./pages/Index";
import Sidebar from "./components/layout/Sidebar";

const App = () => (
  <BrowserRouter>
    <div className="d-flex h-100">
      <Sidebar />
      <div className="flex-grow-1 overflow-hidden">
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
          <Route path="/" element={<Index />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
);

export default App;
