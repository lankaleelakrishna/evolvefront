import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { API_BASE_URL } from "../../../../config/api";
import "./AdminJobs.css";
import axios from "axios";

const AdminJobs = ({ filteredJobs: propJobs, onRemoveJob }) => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        if (propJobs && propJobs.length > 0) {
            const formatted = propJobs.map((j) => ({
                id: j.id || j.jobId || j.postId,
                title: j.title || j.jobTitle,
                company: j.company || j.compName,
                reason: j.reason || "Expired",
                applicationDeadline: j.applicationDeadline || j.deadline || "N/A"
            }));

            setJobs(formatted);
        } else {
            fetchJobs();
        }
    }, [propJobs]);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/aftergrad/expired`);

            const formatted = (res.data || []).map((j) => ({
                id: j.id,
                title: j.jobTitle || j.title,
                company: j.compName || j.company,
                reason: j.reason || "Expired",
                applicationDeadline: j.applicationDeadline || j.deadline || "N/A"
            }));

            setJobs(formatted);
        } catch (error) {
            console.error("Jobs API Error:", error);
        }
    };

    const handleRemove = async (id) => {
        if (!id) {
            console.error("Invalid Job ID:", id);
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/api/aftergrad/admin/delete/${id}`);

            setJobs((prev) => prev.filter((job) => job.id !== id));

            if (onRemoveJob) onRemoveJob(id);
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    return (
        <div className="adminSectionCard">
            <div className="adminSectionHeader">
                <h2>Remove Expired Jobs</h2>
                <span className="adminSectionCount">
                    Total: {jobs.length}
                </span>
            </div>

            <div className="adminJobList">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div className="adminJobItem" key={job.id}>
                            <div className="adminJobInfo">
                                <h3>{job.title}</h3>
                                <p>{job.company}</p>
                                <span>
                                    Reason: <strong>{job.reason}</strong>
                                </span>
                                <small>
                                    Deadline: {job.applicationDeadline}
                                </small>
                            </div>

                            <div className="adminCompanyActions">
                                <button
                                    className="rejectBtn"
                                    onClick={() => handleRemove(job.id)}
                                >
                                    <FaTrashAlt /> Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="adminNoCardData">
                        No job postings found
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminJobs;