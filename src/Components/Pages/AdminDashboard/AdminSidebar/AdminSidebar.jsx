import React, { useState } from "react";
import {
    FaTachometerAlt,
    FaUsers,
    FaBuilding,
    FaTrashAlt,
    FaBars,
    FaTimes,
    FaFileExcel,
    FaHeadset,
    FaEnvelope,
    FaBookOpen,
    FaHandshake,
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = ({
    activeMenu,
    onChangeMenu,
    supportCount = 0,
    contactCount = 0,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuClick = (menu) => {
        onChangeMenu(menu);
        setSidebarOpen(false);
    };

    return (
        <>
            <button
                className="adminHamburger"
                onClick={() => setSidebarOpen(true)}
            >
                <FaBars />
            </button>

            {sidebarOpen && (
                <div
                    className="adminSidebarOverlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <aside className={`adminSidebar ${sidebarOpen ? "adminSidebarOpen" : ""}`}>
                <button
                    className="adminSidebarClose"
                    onClick={() => setSidebarOpen(false)}
                >
                    <FaTimes />
                </button>

                <div className="adminSidebarTop">
                    <div className="adminLogoBox">
                        <div className="adminLogoIcon">A</div>

                        <div>
                            <h2 className="adminLogoText">Admin Panel</h2>
                            <p className="adminLogoSubtext">Job Portal</p>
                        </div>
                    </div>

                    <ul className="adminSidebarMenu">
                        <li
                            className={activeMenu === "analytics" ? "active" : ""}
                            onClick={() => handleMenuClick("analytics")}
                        >
                            <FaTachometerAlt />
                            <span>Analytics Dashboard</span>
                        </li>

                        <li
                            className={activeMenu === "users" ? "active" : ""}
                            onClick={() => handleMenuClick("users")}
                        >
                            <FaUsers />
                            <span>Manage Users & Employers</span>
                        </li>

                        <li
                            className={activeMenu === "companies" ? "active" : ""}
                            onClick={() => handleMenuClick("companies")}
                        >
                            <FaBuilding />
                            <span>Company Profiles</span>
                        </li>

                        <li
                            className={activeMenu === "courses" ? "active" : ""}
                            onClick={() => handleMenuClick("courses")}
                        >
                            <FaBookOpen />
                            <span>Manage Courses</span>
                        </li>

                        <li
                            className={activeMenu === "vendors" ? "active" : ""}
                            onClick={() => handleMenuClick("vendors")}
                        >
                            <FaHandshake />
                            <span>Vendor Management</span>
                        </li>

                        <li
                            className={activeMenu === "jobs" ? "active" : ""}
                            onClick={() => handleMenuClick("jobs")}
                        >
                            <FaTrashAlt />
                            <span>Remove Expired Jobs</span>
                        </li>

                        <li
                            className={activeMenu === "supportRequests" ? "active" : ""}
                            onClick={() => handleMenuClick("supportRequests")}
                        >
                            <FaHeadset />
                            <span>Support Requests</span>

                            {supportCount > 0 && (
                                <strong className="adminSupportSidebarBadge">
                                    {supportCount}
                                </strong>
                            )}
                        </li>

                        <li
                            className={activeMenu === "contactMessages" ? "active" : ""}
                            onClick={() => handleMenuClick("contactMessages")}
                        >
                            <FaEnvelope />
                            <span>Contact Messages</span>

                            {contactCount > 0 && (
                                <strong className="adminSupportSidebarBadge">
                                    {contactCount}
                                </strong>
                            )}
                        </li>

                        <li
                            className={activeMenu === "loginReports" ? "active" : ""}
                            onClick={() => handleMenuClick("loginReports")}
                        >
                            <FaFileExcel />
                            <span>Login Reports</span>
                        </li>
                    </ul>
                </div>

                <div className="adminSidebarBottom">
                    <div className="adminAdminProfile"></div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;