import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./ManageJobs.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);

    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        fetchJobs();
        fetchCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/aftergrad/user/${userId}`
            );
            setJobs(res.data);
        } catch (error) {
            console.error("Fetch Jobs Error:", error);
        }
    };

    const fetchCompany = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/company-profile/user/${userId}`
            );
            setCompany(res.data);
        } catch (error) {
            console.error("Company fetch error:", error);
        }
    };

    const getLogoUrl = () => {
        if (!company?.id) return null;
        return `http://localhost:8080/api/company-profile/${company.id}/logo`;
    };

    const handleEdit = (job) => {
        navigate("/postjob", { state: { job } });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:8080/api/aftergrad/delete/${id}/${userId}`
            );
            setJobs((prev) => prev.filter((job) => job.id !== id));
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    return (
        <div className="employeeDashboardSectionCard">
            <div className="employeeDashboardSectionHeader">
                <h2>Edit or Delete Job Postings</h2>
                <span className="employeeDashboardSectionCount">
                    Total: {jobs.length}
                </span>
            </div>

            <div className="employeeDashboardJobList">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div className="employeeDashboardJobCard" key={job.id}>
                            <div className="jobLogo">
                                <img
                                    src={
                                        getLogoUrl() ||
                                        "https://via.placeholder.com/60"
                                    }
                                    alt="Company Logo"
                                />
                            </div>

                            <div className="employeeDashboardJobInfo">
                                <h3>{job.jobTitle}</h3>
                                <p>{job.compName}</p>
                                <span>{job.location}</span>
                                <span>{job.salary}</span>
                                <span>{job.jobType}</span>
                                <span>Experience required: {job.expReq}</span>
                                <small>{job.jobDescription}</small>
                            </div>
                            <div className="employeeDashboardJobActions">
                                <button
                                    className="editBtn"
                                    onClick={() => handleEdit(job)}
                                >
                                    <FaEdit /> Edit
                                </button>

                                <button
                                    className="deleteBtn"
                                    onClick={() => handleDelete(job.id)}
                                >
                                    <FaTrashAlt /> Delete
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="employeeDashboardEmptyState">
                        No jobs found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;