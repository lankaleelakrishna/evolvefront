import React, { useEffect, useState } from "react";
import "./SavedJob.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const jobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
        setSavedJobs(jobs);
    }, []);

    const removeJob = (id) => {
        const updatedJobs = savedJobs.filter((job) => job.id !== id);
        setSavedJobs(updatedJobs);
        localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    };

    return (
        <>
            <NavBar />

            <div className="saved-page">
                <div className="saved-layout">

                    {/* ✅ SAME SIDEBAR */}
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
                                🏠 Dashboard
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/my-profile")}
                            >
                                👤 My Profile
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/MyApplication")}
                            >
                                📄 My Applications
                            </div>

                            <div className="myapp-sidebar-item active">
                                💾 Saved Jobs
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/jobs")}
                            >
                                🔎 Browse Jobs
                            </div>
                        </div>
                    </aside>

                    {/* CONTENT */}
                    <div className="saved-content">
                        <div className="saved-header">
                            <h1>Saved Jobs</h1>
                            <button onClick={() => navigate("/jobs")}>
                                Browse Jobs
                            </button>
                        </div>

                        {savedJobs.length === 0 ? (
                            <div className="no-saved-box">
                                <h3>No Saved Jobs</h3>
                                <p>You haven’t saved any jobs yet.</p>
                                <button onClick={() => navigate("/jobs")}>
                                    Explore Jobs
                                </button>
                            </div>
                        ) : (
                            <div className="saved-container">
                                {savedJobs.map((job) => (
                                    <div className="saved-card" key={job.id}>

                                        <div className="saved-left">
                                            <div className="saved-icon">💼</div>

                                            <div>
                                                <h3>{job.title}</h3>
                                                <p className="company">{job.company}</p>

                                                <div className="meta">
                                                    <span>{job.location}</span>
                                                    <span>{job.displaySalary}</span>
                                                    <span>
                                                        {job.experienceText || "Experience not specified"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="saved-actions">
                                            <button
                                                className="view-btn"
                                                onClick={() => navigate(`/job-details/${job.id}`)}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="remove-btn"
                                                onClick={() => removeJob(job.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default SavedJobs;