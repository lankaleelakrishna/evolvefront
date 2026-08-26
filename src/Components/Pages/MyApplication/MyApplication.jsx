import React from "react";
import "./MyApplication.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import { useNavigate } from "react-router-dom";

import tcsLogo from "../../../assets/tcs.png";
import infosysLogo from "../../../assets/infosys-logo.png";
import googleLogo from "../../../assets/google.png";

const applications = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TCS",
        location: "Hyderabad",
        status: "Pending",
        appliedDate: "12 Apr 2026",
        type: "Full Time",
        logo: tcsLogo,
    },
    {
        id: 2,
        title: "Backend Developer",
        company: "Infosys",
        location: "Bangalore",
        status: "Accepted",
        appliedDate: "10 Apr 2026",
        type: "Hybrid",
        logo: infosysLogo,
    },
    {
        id: 3,
        title: "UI Designer",
        company: "Google",
        location: "Chennai",
        status: "Rejected",
        appliedDate: "06 Apr 2026",
        type: "Remote",
        logo: googleLogo,
    },
];

export default function MyApplication() {
    const navigate = useNavigate();

    const totalApplications = applications.length;
    const pendingApplications = applications.filter(
        (app) => app.status === "Pending"
    ).length;
    const acceptedApplications = applications.filter(
        (app) => app.status === "Accepted"
    ).length;
    const rejectedApplications = applications.filter(
        (app) => app.status === "Rejected"
    ).length;

    return (
        <>
            <NavBar />

            <div className="myapp-page">
                <div className="myapp-layout">
                    <aside className="myapp-sidebar">
                        <div className="myapp-sidebar-header">
                            <div className="myapp-sidebar-avatar">P</div>
                            <h3>Pradeep</h3>
                            <p>Candidate Panel</p>
                        </div>

                        <div className="myapp-sidebar-menu">
                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/student-dashboard")}
                            >
                                <span>🏠</span>
                                <span>Dashboard</span>
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/my-profile")}
                            >
                                <span>👤</span>
                                <span>My Profile</span>
                            </div>

                            <div className="myapp-sidebar-item active">
                                <span>📄</span>
                                <span>My Applications</span>
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/saved-jobs")}
                            >
                                <span>💾</span>
                                <span>Saved Jobs</span>
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/jobs")}
                            >
                                <span>🔎</span>
                                <span>Browse Jobs</span>
                            </div>
                        </div>
                    </aside>

                    <div className="myapp-content">
                        <div className="myapp-header">
                            <div>
                                <h1 className="myapp-title">My Applications</h1>
                                <p className="myapp-subtitle">
                                    Track all your job applications and their current status in one place.
                                </p>
                            </div>

                            <button
                                className="myapp-browse-btn"
                                onClick={() => navigate("/jobs")}
                            >
                                Browse More Jobs
                            </button>
                        </div>

                        <div className="myapp-stats">
                            <div className="myapp-stat-card">
                                <h3>{totalApplications}</h3>
                                <p>Total Applications</p>
                            </div>

                            <div className="myapp-stat-card pending-card">
                                <h3>{pendingApplications}</h3>
                                <p>Pending</p>
                            </div>

                            <div className="myapp-stat-card accepted-card">
                                <h3>{acceptedApplications}</h3>
                                <p>Accepted</p>
                            </div>

                            <div className="myapp-stat-card rejected-card">
                                <h3>{rejectedApplications}</h3>
                                <p>Rejected</p>
                            </div>
                        </div>

                        <div className="myapp-container">
                            {applications.map((app) => (
                                <div className="myapp-card" key={app.id}>
                                    <div className="myapp-card-left">
                                        <img
                                            src={app.logo}
                                            alt={app.company}
                                            className="myapp-company-logo"
                                        />

                                        <div className="myapp-info">
                                            <h2>{app.title}</h2>
                                            <p className="company">{app.company}</p>

                                            <div className="myapp-meta">
                                                <span>{app.location}</span>
                                                <span>{app.type}</span>
                                                <span>Applied on {app.appliedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="myapp-status-section">
                                        <span className={`status ${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>

                                        <div className="myapp-actions">
                                            <button
                                                className="view-btn"
                                                onClick={() => navigate("/jobs")}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="details-btn"
                                                onClick={() => navigate("/job-details")}
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}