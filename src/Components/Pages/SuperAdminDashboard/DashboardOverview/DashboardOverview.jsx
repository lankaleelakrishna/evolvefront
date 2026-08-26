import React, { useEffect, useState } from "react";
import "./DashboardOverview.css";
import {
    FaUserShield,
    FaUserCheck,
    FaUsers,
} from "react-icons/fa";
import axios from "axios";

const DashboardOverview = () => {
    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("authToken")
        );
    };

    // FETCH API
    const fetchDashboard = async () => {
        try {
            const token = getToken();

            const res = await axios.get("http://localhost:8080/admin/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = res.data;

            const formattedStats = [
                {
                    id: 1,
                    title: "Total Users",
                    value: data.totalUsers || 0,
                    icon: <FaUsers />,
                    className: "blue",
                },
                {
                    id: 2,
                    title: "Candidates",
                    value: data.candidates || 0,
                    icon: <FaUserCheck />,
                    className: "green",
                },
                {
                    id: 3,
                    title: "Employers",
                    value: data.employers || 0,
                    icon: <FaUserShield />,
                    className: "purple",
                },
            ];

            setStats(formattedStats);

            setActivities([
                `${data.totalUsers || 0} users registered`,
                `${data.employers || 0} employers available`,
                `${data.flaggedJobs || 0} jobs flagged/expired`,
            ]);
        } catch (error) {
            console.error("Dashboard API Error:", error);

            if (error.response?.status === 401) {
                console.log("Token missing, invalid, or expired. Please login again.");
            }
        }
    };

    return (
        <div className="dashboardOverview">
            <div className="dashboardStatsGrid">
                {stats.map((item) => (
                    <div className="dashboardStatCard" key={item.id}>
                        <div className={`dashboardStatIcon ${item.className}`}>
                            {item.icon}
                        </div>

                        <div>
                            <h3>{item.value}</h3>
                            <p>{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboardCard">
                <div className="dashboardCardHeader">
                    <h2>Recent Activity</h2>
                </div>

                <div className="dashboardList">
                    {activities.map((activity, index) => (
                        <div className="dashboardListItem" key={index}>
                            {activity}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;