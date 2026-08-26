import React from "react";
import "./SuperAdminSidebar.css";
import {
  FaChartLine,
  FaUserShield,
  FaUsersCog,
  FaCog,
  FaBell,
  FaLock,
  FaTimes,
} from "react-icons/fa";

const SuperAdminSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { id: "admins", label: "Manage Admins", icon: <FaUserShield /> },
    { id: "users", label: "System Users", icon: <FaUsersCog /> },
    { id: "settings", label: "System Settings", icon: <FaCog /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "security", label: "Security Logs", icon: <FaLock /> },
  ];

  return (
    <>
      <div
        className={`superAdminSidebarOverlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`superAdminSidebar ${sidebarOpen ? "open" : ""}`}>
        <div>
          <div className="superAdminSidebarHeader">
            <div className="superAdminBrand">
              <div className="superAdminBrandIcon">◆</div>
              <div>
                <h2>EVOLVE</h2>
                <p>Super Admin</p>
              </div>
            </div>

            <button
              className="superAdminCloseBtn"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="superAdminSidebarMenu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`superAdminSidebarItem ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;