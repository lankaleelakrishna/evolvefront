import React from "react";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import axios from "axios";
import "./Applicants.css";

const Applicants = ({ applicants = [], fetchApplicants }) => {
    const onApplicantAction = async (id, action) => {
        try {
            const token = localStorage.getItem("token");
            const status = action === "shortlist" ? "SHORTLISTED" : "REJECTED";

            await axios.put(
                `http://localhost:8080/application/update-status/${id}`,
                null,
                {
                    params: { status },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchApplicants && fetchApplicants();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("You are not allowed to update this applicant status.");
        }
    };

    return (
        <div className="employeeDashboardSectionCard">
            <div className="employeeDashboardSectionHeader">
                <h2>View Applicant List</h2>
                <span className="employeeDashboardSectionCount">
                    Total: {applicants.length}
                </span>
            </div>

            <div className="employeeDashboardTableWrapper">
                <table className="employeeDashboardTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Applied For</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {applicants.length > 0 ? (
                            applicants.map((applicant) => {
                                const status = applicant.status || "APPLIED";

                                return (
                                    <tr key={applicant.id}>
                                        <td>{applicant.firstName}</td>
                                        <td>{applicant.email}</td>
                                        <td>{applicant.jobTitle}</td>

                                        <td>
                                            <span
                                                className={
                                                    status === "SHORTLISTED"
                                                        ? "statusBadge shortlistStatus"
                                                        : status === "REJECTED"
                                                        ? "statusBadge rejectStatus"
                                                        : "statusBadge pendingStatus"
                                                }
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="shortlistBtn"
                                                disabled={status === "SHORTLISTED"}
                                                onClick={() =>
                                                    onApplicantAction(applicant.id, "shortlist")
                                                }
                                            >
                                                <FaUserCheck /> Shortlist
                                            </button>

                                            <button
                                                className="rejectBtn"
                                                disabled={status === "REJECTED"}
                                                onClick={() =>
                                                    onApplicantAction(applicant.id, "reject")
                                                }
                                            >
                                                <FaUserTimes /> Reject
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5">No applicants found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Applicants;