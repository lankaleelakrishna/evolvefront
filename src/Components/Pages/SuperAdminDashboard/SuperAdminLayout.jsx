import React, { useState, useEffect } from "react";
import "./SuperAdminLayout.css";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import ManageAdmins from "./ManageAdmins/ManageAdmins";
import SystemUsers from "./SystemUsers/SystemUsers";
import SystemSettings from "./SystemSettings/SystemSettings";
import NotificationsPage from "./NotificationsPage/NotificationsPage";
import SecurityLogs from "./SecurityLogs/SecurityLogs";
import SuperAdminSidebar from "./SuperAdminSidebar/SuperAdminSidebar";
import NavBar from "../../HomePage/NavBar/NavBar";
import axios from "axios";

const SuperAdminLayout = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchNotificationCount();

        const interval = setInterval(fetchNotificationCount, 10000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNotificationCount = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const unread = (res.data || []).filter((n) => !n.read).length;

            setNotificationCount(unread);

        } catch (error) {
            console.error("Notification count error:", error);
        }
    };
    const handleSearch = async (value) => {
        setSearch(value);

        if (!value) return;

        try {
            await axios.get(
                `http://localhost:8080/admin/search?query=${value}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const renderTitle = () => {
        switch (activePage) {
            case "dashboard":
                return "Super Admin Dashboard";
            case "admins":
                return "Manage Admins";
            case "users":
                return "System Users";
            case "settings":
                return "System Settings";
            case "notifications":
                return "Notifications";
            case "security":
                return "Security Logs";
            default:
                return "Super Admin Dashboard";
        }
    };

    const renderSubtitle = () => {
        switch (activePage) {
            case "dashboard":
                return "Monitor the entire job portal system, admins, users, and platform activity.";
            case "admins":
                return "Add, update, and control all admin accounts from one place.";
            case "users":
                return "Manage all candidates, employers, and platform users.";
            case "settings":
                return "Control global system settings and platform configuration.";
            case "notifications":
                return "Review system alerts, updates, and important admin notifications.";
            case "security":
                return "Track login activity, system access, and important security events.";
            default:
                return "Manage the complete job portal from one place.";
        }
    };

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <DashboardOverview />;
            case "admins":
                return <ManageAdmins />;
            case "users":
                return <SystemUsers />;
            case "settings":
                return <SystemSettings />;
            case "notifications":
                return <NotificationsPage />;
            case "security":
                return <SecurityLogs />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <>
            <NavBar />

            <div className="superAdminLayout">

                {sidebarOpen && (
                    <div
                        className="superAdminOverlay"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                <SuperAdminSidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="superAdminMain">

                    <div className="superAdminTopbar">

                        <div className="superAdminTopbarLeft">

                            <button
                                className="superAdminMenuBtn"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <FaBars />
                            </button>

                            <div className="superAdminTitleBlock">
                                <span className="superAdminPageTag">
                                    Super Admin Panel
                                </span>

                                <h1>{renderTitle()}</h1>

                                <p>{renderSubtitle()}</p>
                            </div>
                        </div>

                        <div className="superAdminTopbarRight">
                            <div className="superAdminSearchBox">
                                <FaSearch />

                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    value={search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                />
                            </div>
                            <button
                                className="superAdminNotifyBtn"
                                onClick={() =>
                                    setActivePage("notifications")
                                }
                            >
                                <FaBell />

                                {notificationCount > 0 && (
                                    <span className="superAdminNotifyDot">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>

                        </div>
                    </div>
                    <div className="superAdminContentWrapper">

                        <div className="superAdminContent">
                            {renderPage()}
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default SuperAdminLayout;