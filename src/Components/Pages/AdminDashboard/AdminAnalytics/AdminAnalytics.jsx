import React, { useEffect, useState } from "react";
import "./AdminAnalytics.css";
import axios from "axios";

const AdminAnalytics = ({ analytics: propAnalytics }) => {

    const [analytics, setAnalytics] = useState(
        propAnalytics || {
            totalUsers: 0,
            candidates: 0,
            employers: 0,
            blockedUsers: 0,
        }
    );

    useEffect(() => {

        if (propAnalytics) {
            setAnalytics(propAnalytics);
            return;
        }

        const fetchAnalytics = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:8080/admin/dashboard"
                );

                setAnalytics(res.data);

            } catch (error) {
                console.error("Analytics API Error:", error);
            }
        };

        fetchAnalytics();

    }, [propAnalytics]);

    return (
        <div className="adminSectionCard">

            <div className="adminSectionHeader">
                <h2>Analytics Dashboard</h2>
            </div>

            <div className="adminAnalyticsGrid">

                <div className="adminAnalyticsBox">
                    <h3>Total Users</h3>

                    <h2>{analytics.totalUsers}</h2>

                    <p>
                        Includes candidates and employers
                    </p>
                </div>

                <div className="adminAnalyticsBox">
                    <h3>Total Candidates</h3>

                    <h2>{analytics.candidates}</h2>

                    <p>
                        Active job seekers on platform
                    </p>
                </div>

                <div className="adminAnalyticsBox">
                    <h3>Total Employers</h3>

                    <h2>{analytics.employers}</h2>

                    <p>
                        Registered hiring companies
                    </p>
                </div>

                <div className="adminAnalyticsBox">
                    <h3>Blocked Users</h3>

                    <h2>{analytics.blockedUsers}</h2>

                    <p>
                        Accounts restricted by admin
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AdminAnalytics;