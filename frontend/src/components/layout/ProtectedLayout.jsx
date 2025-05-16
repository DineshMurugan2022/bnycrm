import React from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Sidebar from "./Sidebar";

const ProtectedLayout = ({ children }) => {
  const location = useLocation();

  // Show sidebar on these routes (add/remove routes as needed)
  const sidebarRoutes = ["/Index"];
  const showSidebar = sidebarRoutes.includes(location.pathname);

  // Always show navbar
  const showNavigationBar = true;

  return (
    <>
      {showNavigationBar && <NavigationBar />}
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {showSidebar && <Sidebar />}
        <div className="flex-grow-1 overflow-hidden p-3">{children}</div>
      </div>
    </>
  );
};

export default ProtectedLayout;
