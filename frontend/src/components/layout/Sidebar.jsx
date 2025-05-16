import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaBullseye, FaTasks, FaCalendarAlt,
  FaChartBar, FaUserPlus, FaCog, FaChevronLeft, FaChevronRight, FaSignOutAlt
} from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

const SidebarItem = ({ icon, label, to, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `d-flex align-items-center gap-2 p-2 rounded text-decoration-none 
         ${isActive ? 'bg-primary text-white fw-semibold' : 'text-dark'}
         ${collapsed ? 'justify-content-center' : ''}`
      }
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`d-flex flex-column border-end bg-light transition-all ${
        collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}
      style={{
        height: '100vh',
        width: collapsed ? '60px' : '240px',
        transition: 'width 0.3s',
        padding: '10px'
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        {!collapsed && (
          <div className="d-flex align-items-center gap-2">
           <img src="https://bnytechnologies.in/img/logo.png" alt="Logo" style={{ width: 30, height: 30 }} />

            <span className="fw-bold">B&Y CRM</span>
          </div>
        )}
        <Button
          variant="light"
          size="sm"
          className="rounded-circle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </Button>
      </div>

      <div className="d-flex flex-column gap-1">
        <SidebarItem icon={<FaTachometerAlt />} label="Dashboard" to="/Index" collapsed={collapsed} />
        <SidebarItem icon={<FaUsers />} label="Monitoring" to="/Monitoring" collapsed={collapsed} />
        <SidebarItem icon={<FaBullseye />} label="Leads" to="/leads" collapsed={collapsed} />
        <SidebarItem icon={<FaTasks />} label="Tasks" to="/tasks" collapsed={collapsed} />
        <SidebarItem icon={<FaCalendarAlt />} label="Calendar" to="/calendar" collapsed={collapsed} />
        {/* <SidebarItem icon={<FaChartBar />} label="Reports" to="/reports" collapsed={collapsed} /> */}
        <SidebarItem icon={<FaUserPlus />} label="Team" to="/team" collapsed={collapsed} />
        <SidebarItem icon={<FaSignOutAlt />} label="Call" to="/call" collapsed={collapsed} />
        <SidebarItem icon={<FaUserPlus/>} label="Appointment" to="/appointment" collapsed={collapsed} />
        <SidebarItem icon={<FaSignOutAlt />} label="BDM" to="/bdm" collapsed={collapsed} />
      </div>

      <div className="mt-auto pt-3">
        <SidebarItem icon={<FaCog />} label="Settings" to="/settings" collapsed={collapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
