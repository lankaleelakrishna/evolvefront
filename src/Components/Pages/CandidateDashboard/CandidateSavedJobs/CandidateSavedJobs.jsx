import React, { useEffect, useState } from "react";
import { FaBookmark, FaBriefcase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CandidateSavedJobs.css";

const CandidateSavedJobs = ({
    savedJobs,
    applications,
    onSaveJob,
    onApplyJob,
}) => {

    const navigate = useNavigate();

    const [apiSavedJobs, setApiSavedJobs] = useState([]);
    const [companyMap, setCompanyMap] = useState({});

    const storedUserId = localStorage.getItem("userId");
    const userId = storedUserId && storedUserId !== "undefined"
        ? Number(storedUserId)
        : null;

    const fetchSavedJobs = () => {
        if (!userId) return;

        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/api/saved-jobs/${userId}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then(res => res.json())
            .then(data => {

                const mapped = Array.isArray(data) ? data.map(item => ({
                    id: item.id,
                    title: item.jobTitle,
                    company: item.compName,
                    location: item.location,
                    salary: item.salary,
                    category: item.jobType,
                    description: item.jobDescription,
                    userId: item.companyUserId || item.userId
                })) : [];

                setApiSavedJobs(mapped);

                const uniqueUserIds = [...new Set(mapped.map(j => j.userId).filter(Boolean))];
                uniqueUserIds.forEach(fetchCompanyLogo);

            })
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchSavedJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (savedJobs && savedJobs.length > 0) {
            const uniqueUserIds = [...new Set(savedJobs.map(j => j.userId).filter(Boolean))];
            uniqueUserIds.forEach(fetchCompanyLogo);
        }
    }, [savedJobs]);

    const fetchCompanyLogo = async (userId) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/company-profile/user/${userId}`
            );

            if (!res.ok) return;

            const data = await res.json();

            setCompanyMap(prev => ({
                ...prev,
                [userId]: data.id
            }));

        } catch (error) {
            console.error("Company fetch error:", error);
        }
    };

    const jobsToShow = apiSavedJobs.length > 0 ? apiSavedJobs : savedJobs;

    const handleRemoveSaved = async (job) => {
        try {
            if (!userId) return;

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/saved-jobs/del?userId=${userId}&jobId=${job.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (!response.ok) {
                alert("Unable to remove saved job");
                return;
            }

            setApiSavedJobs(prev => prev.filter(j => Number(j.id) !== Number(job.id)));
            onSaveJob(job);

        } catch (error) {
            console.error("Error removing saved job:", error);
        }
    };

    const handleApplyClick = (job) => {
        onApplyJob(job);
        localStorage.setItem("selectedJob", JSON.stringify(job));
        navigate("/job-application");
    };

    return (
        <div className="candidateDashboardSectionCard">

            <div className="candidateDashboardSectionHeader">
                <h2>Saved Jobs (Bookmark)</h2>
                <span className="candidateDashboardSectionCount">
                    Total: {jobsToShow.length}
                </span>
            </div>

            <div className="candidateDashboardJobList">
                {jobsToShow.length > 0 ? (
                    jobsToShow.map((job) => {
                        const companyId = companyMap[job.userId];

                        const logoUrl = companyId
                            ? `http://localhost:8080/api/company-profile/${companyId}/logo`
                            : "https://via.placeholder.com/60";

                        const isApplied = applications.some(
                            (application) =>
                                Number(application.jobId || application.job?.id) === Number(job.id)
                        );

                        return (
                            <div className="candidateDashboardJobCard" key={job.id}>
                                <div className="jobLogo">
                                    <img
                                        src={logoUrl}
                                        alt="logo"
                                        onError={(e) =>
                                            e.target.src = "https://via.placeholder.com/60"
                                        }
                                    />
                                </div>

                                <div className="candidateDashboardJobInfo">
                                    <h3>{job.title}</h3>
                                    <p>{job.company}</p>

                                    <span>{job.location}</span>
                                    <span>₹{Number(job.salary).toLocaleString("en-IN")}</span>
                                    <span>{job.category}</span>

                                    <small>{job.description}</small>
                                </div>

                                <div className="candidateDashboardJobActions">
                                    <button
                                        className="removeBookmarkBtn"
                                        onClick={() => handleRemoveSaved(job)}
                                    >
                                        <FaBookmark /> Remove Saved
                                    </button>

                                    <button
                                        className="applyBtn"
                                        onClick={() => handleApplyClick(job)}
                                        disabled={isApplied}
                                    >
                                        <FaBriefcase />
                                        {isApplied ? "Applied" : "Apply Now"}
                                    </button>
                                </div>

                            </div>
                        );
                    })
                ) : (
                    <div className="candidateDashboardEmptyState">
                        No saved jobs found
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateSavedJobs;