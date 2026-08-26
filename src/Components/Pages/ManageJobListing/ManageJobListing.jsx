import React, { useState } from "react";
import "./ManageJobListing.css";
import { jobsData } from "../../jsondata/jobsData";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaBuilding, FaExclamationTriangle, FaHome, FaUser } from "react-icons/fa";
import Logo from "../../../assets/Logo2.png";

const ManageJobListing = () => {
    const navigate = useNavigate();
    const [openSidebar, setOpenSidebar] = useState(false); 

    const [jobs, setJobs] = useState(jobsData);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const totalJobs = jobs.length;
    const totalPages = Math.ceil(totalJobs / pageSize) || 1;

    const startIndex = (currentPage - 1) * pageSize;
    const currentJobs = jobs.slice(startIndex, startIndex + pageSize);

    const removeJob = (id) => {
        const updatedJobs = jobs.filter((job) => job.id !== id);
        setJobs(updatedJobs);

       
        if ((currentPage - 1) * pageSize >= updatedJobs.length && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let p = 1; p <= totalPages; p++) {
            pages.push(
                <button
                    key={p}
                    className={`pagination-page-btn ${currentPage === p ? "active" : ""
                        }`}
                    onClick={() => handlePageChange(p)}
                >
                    {p}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="manage-jobs-page">
            <div className="jobs-main-content">

                <div className={`sidebar-main ${openSidebar ? "open" : ""}`} style={{ width: "240px" }}>

                    <div className="for-logo" style={{ marginTop: "20px" }}>
                        <div
                            className="navbar-logo"
                            onClick={() => (window.location.href = "/")}
                        >
                            <img src={Logo} alt="Job Portal Logo" className="logo-img" />
                            <span className="logo-texts">Aftergraduate</span>
                        </div>
                    </div>

                    <div className="side-item active" style={{ marginTop: "35px" }}>
                        <FaHome /> Dashboard
                    </div>

                    <div
                        className="side-item"
                        onClick={() => {
                            navigate(`/users`);
                            setOpenSidebar(false);
                        }}
                    >
                        <FaUser /> Manage Users
                    </div>

                    <div
                        className="side-item"
                        onClick={() => {
                            navigate(`/EmployerUser`);
                            setOpenSidebar(false);
                        }}
                    >
                        <FaBuilding /> Manage Employers
                    </div>

                    <div
                        className="side-item"
                        onClick={() => {
                            navigate(`/ManageJobListing`);
                            setOpenSidebar(false);
                        }}
                    >
                        <FaBriefcase /> Manage Job Listings
                    </div>

                    <div className="side-item">
                        <FaExclamationTriangle /> Reports & Feedback
                    </div>
                </div>

                <div className="jobs-list-container">
                    {jobs.length === 0 ? (
                        <div className="no-jobs-found">
                            <h3>No jobs found</h3>
                            <p>No job listings available</p>
                        </div>
                    ) : (
                        <>
                            <div className="jobs-list" style={{marginTop:"90px"}}>
                                {currentJobs.map((job) => (
                                    <div
                                        className="job-list-card"
                                        key={job.id}
                                    >
                                        <div className="job-logo">
                                            <img src={job.logo} alt={job.company} />
                                        </div>

                                        <div className="job-list-info">
                                            <div className="job-list-title">
                                                {job.title}
                                            </div>
                                            <div className="job-list-salary">
                                                {job.displaySalary}
                                            </div>
                                            <div className="job-list-meta">
                                                <span className="job-list-location">
                                                    {job.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="job-list-actions">
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

                            <div className="pagination">
                                <button
                                    className="pagination-nav-btn"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>

                                {renderPageNumbers()}

                                <button
                                    className="pagination-nav-btn"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageJobListing;