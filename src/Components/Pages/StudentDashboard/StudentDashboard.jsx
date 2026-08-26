import React from "react";
import "./StudentDashboard.css";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
    const navigate = useNavigate();

    const recommendedJobs = [
        {
            id: 1,
            title: "Software Engineer",
            company: "Google",
            location: "Bangalore, India",
            type: "Full Time"
        },
        {
            id: 2,
            title: "Digital Marketing Specialist",
            company: "Amazon",
            location: "Hyderabad, India",
            type: "Remote"
        },
        {
            id: 3,
            title: "Frontend Developer Intern",
            company: "Infosys",
            location: "Chennai, India",
            type: "Internship"
        }
    ];

    const recentActivities = [
        "Applied for UI/UX Designer role at TCS",
        "Saved Frontend Developer job at Wipro",
        "Profile completion updated to 85%",
        "Viewed 6 new job recommendations"
    ];

    return (
        <>
            <NavBar />

            <div className="dashboard-container">
                <div className="dashboard-main">
                    <aside className="sidebar">
                        <div className="sidebar-top">
                            <div className="student-profile-card">
                                <div className="student-avatar">P</div>
                                <h3>Pradeep</h3>
                                <p>Candidate Dashboard</p>
                            </div>

                            <div className="sidebar-menu">
                                <div className="sidebar-item active">
                                    <span>🏠</span>
                                    <span>Dashboard</span>
                                </div>

                                <div
                                    className="sidebar-item"
                                    onClick={() => navigate("/my-profile")}
                                >
                                    <span>👤</span>
                                    <span>My Profile</span>
                                </div>

                                <div
                                    className="sidebar-item"
                                    onClick={() => navigate("/MyApplication")}
                                >
                                    <span>📄</span>
                                    <span>My Applications</span>
                                </div>

                                <div
                                    className="sidebar-item"
                                    onClick={() => navigate("/saved-jobs")}
                                >
                                    <span>💾</span>
                                    <span>Saved Jobs</span>
                                </div>

                                <div
                                    className="sidebar-item"
                                    onClick={() => navigate("/jobs")}
                                >
                                    <span>🔎</span>
                                    <span>Browse Jobs</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="dashboard-content">
                        <div className="welcome-banner">
                            <div className="welcome-text">
                                <h2>Welcome Back, Pradeep 👋</h2>
                                <p>
                                    Track your applications, discover jobs, and grow your career from one place.
                                </p>
                            </div>

                            <button
                                className="primary-action-btn"
                                onClick={() => navigate("/jobs")}
                            >
                                Explore Jobs
                            </button>
                        </div>

                        <div className="stats-cards">
                            <div className="card applications-card">
                                <div className="card-icon">📄</div>
                                <div className="card-info">
                                    <h3>12</h3>
                                    <p onClick={() => navigate("/MyApplication")}>
                                        Job Applications
                                    </p>
                                    <span>3 pending review</span>
                                </div>
                            </div>

                            <div className="card saved-card">
                                <div className="card-icon">💾</div>
                                <div className="card-info">
                                    <h3>8</h3>
                                    <p onClick={() => navigate("/saved-jobs")}>
                                        Saved Jobs
                                    </p>
                                    <span>2 new matches</span>
                                </div>
                            </div>

                            <div className="card profile-card">
                                <div className="card-icon">👤</div>
                                <div className="card-info">
                                    <h3>85%</h3>
                                    <p onClick={() => navigate("/my-profile")}>
                                        Profile Completion
                                    </p>
                                    <span>Complete profile to get noticed</span>
                                </div>
                            </div>

                            <div className="card interview-card">
                                <div className="card-icon">🎯</div>
                                <div className="card-info">
                                    <h3>4</h3>
                                    <p>Interview Opportunities</p>
                                    <span>1 scheduled this week</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            <div className="left-sections">
                                <div className="section">
                                    <div className="section-header">
                                        <h3>Job Recommendations</h3>
                                        <span
                                            className="link"
                                            onClick={() => navigate("/jobs")}
                                        >
                                            View All
                                        </span>
                                    </div>

                                    <div className="recommendation-list">
                                        {recommendedJobs.map((job) => (
                                            <div className="job-card" key={job.id}>
                                                <div className="job-card-left">
                                                    <div className="job-badge">💼</div>
                                                    <div>
                                                        <h4>{job.title}</h4>
                                                        <p>{job.company}</p>
                                                        <span>{job.location} • {job.type}</span>
                                                    </div>
                                                </div>

                                                <div className="job-card-actions">
                                                    <button
                                                        className="outline-btn"
                                                        onClick={() => navigate("/saved-jobs")}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="filled-btn"
                                                        onClick={() => navigate("/jobs")}
                                                    >
                                                        View Job
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="section">
                                    <div className="section-header">
                                        <h3>Career Counselling</h3>
                                        <span className="link">See All</span>
                                    </div>

                                    <div className="career-box">
                                        <div className="career-content">
                                            <h4>Book a Session With Career Coach</h4>
                                            <p>
                                                Get resume guidance, interview preparation tips, and personalized career support.
                                            </p>
                                        </div>

                                        <button className="book-btn">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="right-sections">
                                <div className="section small-section">
                                    <div className="section-header">
                                        <h3>Quick Actions</h3>
                                    </div>

                                    <div className="quick-actions">
                                        <button onClick={() => navigate("/student")}>Apply for Jobs</button>
                                        <button onClick={() => navigate("/saved-jobs")}>View Saved Jobs</button>
                                        <button onClick={() => navigate("/my-profile")}>Update Profile</button>
                                        <button onClick={() => navigate("/MyApplication")}>Track Applications</button>
                                    </div>
                                </div>

                                <div className="section small-section">
                                    <div className="section-header">
                                        <h3>Recent Activity</h3>
                                    </div>

                                    <div className="activity-list">
                                        {recentActivities.map((activity, index) => (
                                            <div className="activity-item" key={index}>
                                                <span className="activity-dot"></span>
                                                <p>{activity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="section small-section">
                                    <div className="section-header">
                                        <h3>Tips for You</h3>
                                    </div>

                                    <div className="tips-box">
                                        <p>✔ Add your latest skills to increase recruiter visibility.</p>
                                        <p>✔ Keep your resume updated for better job matches.</p>
                                        <p>✔ Apply early to improve your chances of selection.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default StudentDashboard;