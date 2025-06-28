import React from "react";
import NavigationBar from "../components/Layout/NavigationBar"; // or correct path

const ProtectedLayout = ({ children, showNavbar = true }) => {
  return (
    <div>
      {showNavbar && <NavigationBar />}
      <main>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
