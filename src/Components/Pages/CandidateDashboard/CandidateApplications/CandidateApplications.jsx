import React, { useEffect, useState } from "react";
import "./CandidateApplications.css";
 
const CandidateApplications = ({ applications = [] }) => {
 
    const [apiApplications, setApiApplications] = useState([]);
 
    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("token");
 
        if (!email) return;
 
        fetch(`http://localhost:8080/application/status/${email}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("APPLICATION DATA:", data);
 
                const formatted = data.map((app, index) => ({
                    jobId: index,
                    title: app.jobTitle || app.position,
                    company: app.company || "N/A",
                    status: app.status,
                    appliedDate: app.appliedDate
                        ? new Date(app.appliedDate).toLocaleDateString()
                        : ""
                }));
 
                setApiApplications(formatted);
            })
            .catch(err => console.error("Error fetching applications:", err));
 
    }, []);
 
    const finalApplications = apiApplications.length > 0 ? apiApplications : applications;
 
    return (
        <div className="candidateDashboardSectionCard">
            <div className="candidateDashboardSectionHeader">
                <h2>Track Application Status</h2>
                <span className="candidateDashboardSectionCount">
                    Total: {finalApplications.length}
                </span>
            </div>
 
            <div className="candidateDashboardTableWrapper">
                <table className="candidateDashboardTable">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Applied Date</th>
                        </tr>
                    </thead>
 
                    <tbody>
                        {finalApplications.length > 0 ? (
                            finalApplications.map((application) => (
                                <tr key={application.jobId}>
                                    <td>{application.title}</td>
                                    <td>{application.company}</td>
                                    <td>
                                        <span
                                            className={
                                                application.status === "Shortlisted"
                                                    ? "statusBadge shortlistedStatus"
                                                    : application.status === "Under Review"
                                                        ? "statusBadge reviewStatus"
                                                        : "statusBadge appliedStatus"
                                            }
                                        >
                                            {application.status}
                                        </span>
                                    </td>
                                    <td>{application.appliedDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="candidateDashboardEmptyTable">
                                    No applications found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
 
export default CandidateApplications;
 