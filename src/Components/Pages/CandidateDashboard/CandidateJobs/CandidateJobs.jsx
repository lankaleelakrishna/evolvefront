import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config/api";
import {
    FaSearch,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaTools,
    FaLayerGroup,
    FaBookmark,
    FaRegBookmark,
    FaBriefcase,
    FaMicrophoneAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CandidateJobs.css";

const CandidateJobs = ({
    filters = {},
    applications = [],
    savedJobs = [],
    onFilterChange,
    onSaveJob,
    onApplyJob,
}) => {
    const navigate = useNavigate();

    const [apiJobs, setApiJobs] = useState([]);
    const [companyMap, setCompanyMap] = useState({});

    useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/aftergrad/all`);
            const data = await res.json();

            const mappedJobs = data.map((job) => ({
                id: job.id,
                title: job.jobTitle,
                company: job.compName,
                location: job.location,
                salary: job.salary,
                category: job.jobType,
                description: job.jobDescription,
                skills: job.reqSkills ? job.reqSkills.split(",") : [],
                userId: job.userId,
            }));

            setApiJobs(mappedJobs);

            const uniqueUserIds = [
                ...new Set(mappedJobs.map((j) => j.userId).filter(Boolean)),
            ];

            uniqueUserIds.forEach(fetchCompanyLogo);
        } catch (err) {
            console.error("Error fetching jobs:", err);
        }
    };

    const fetchCompanyLogo = async (userId) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/company-profile/user/${userId}`
            );

            if (!res.ok) return;

            const data = await res.json();

            setCompanyMap((prev) => ({
                ...prev,
                [userId]: data.id,
            }));
        } catch (error) {
            console.error("Company fetch error:", error);
        }
    };

    const jobsToShow = apiJobs.filter((job) => {
        const searchMatch =
            !filters.search ||
            job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.company.toLowerCase().includes(filters.search.toLowerCase());

        const locationMatch =
            !filters.location ||
            job.location.toLowerCase().includes(filters.location.toLowerCase());

        const salaryMatch =
            !filters.salary || Number(job.salary) >= Number(filters.salary);

        const skillsMatch =
            !filters.skills ||
            job.skills.some((skill) =>
                skill.toLowerCase().includes(filters.skills.toLowerCase())
            );

        const categoryMatch =
            !filters.category ||
            job.category.toLowerCase().includes(filters.category.toLowerCase());

        return (
            searchMatch &&
            locationMatch &&
            salaryMatch &&
            skillsMatch &&
            categoryMatch
        );
    });

    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId || storedUserId === "undefined") {
        console.error("Invalid userId:", storedUserId);
        return null;
    }

    const userId = Number(storedUserId);

    const handleSaveJob = async (job) => {
        try {
            const token = localStorage.getItem("token");

            const isAlreadySaved = savedJobs.some(
                (savedJob) => Number(savedJob.id) === Number(job.id)
            );

            if (isAlreadySaved) {
                alert("Already saved");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/saved-jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    userId: userId,
                    jobId: job.id,
                }),
            });

            if (!response.ok) {
                alert("Already saved or error");
                return;
            }

            onSaveJob(job);
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    const handleApplyClick = (job) => {
        localStorage.setItem("selectedJob", JSON.stringify(job));
        navigate("/job-application");
    };

    const handleMockInterviewClick = (job) => {
        localStorage.setItem("selectedJob", JSON.stringify(job));
        navigate(`/mock-interview/${job.id}`);
    };

    return (
        <div className="candidateDashboardSectionCard">
            <div className="candidateDashboardSectionHeader">
                <h2>Search Jobs/Internships</h2>
                <span className="candidateDashboardSectionCount">
                    Total: {jobsToShow.length}
                </span>
            </div>

            <div className="candidateDashboardFilterGrid">
                <div className="candidateDashboardFilterItem">
                    <label>Search</label>
                    <div className="candidateDashboardInputIcon">
                        <FaSearch />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search job title or company"
                            value={filters.search || ""}
                            onChange={onFilterChange}
                        />
                    </div>
                </div>

                <div className="candidateDashboardFilterItem">
                    <label>Location</label>
                    <div className="candidateDashboardInputIcon">
                        <FaMapMarkerAlt />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={filters.location || ""}
                            onChange={onFilterChange}
                        />
                    </div>
                </div>

                <div className="candidateDashboardFilterItem">
                    <label>Minimum Salary</label>
                    <div className="candidateDashboardInputIcon">
                        <FaMoneyBillWave />
                        <input
                            type="number"
                            name="salary"
                            placeholder="Minimum salary"
                            value={filters.salary || ""}
                            onChange={onFilterChange}
                        />
                    </div>
                </div>

                <div className="candidateDashboardFilterItem">
                    <label>Skills</label>
                    <div className="candidateDashboardInputIcon">
                        <FaTools />
                        <input
                            type="text"
                            name="skills"
                            placeholder="Skill"
                            value={filters.skills || ""}
                            onChange={onFilterChange}
                        />
                    </div>
                </div>

                <div className="candidateDashboardFilterItem fullWidth">
                    <label>Category</label>
                    <div className="candidateDashboardInputIcon">
                        <FaLayerGroup />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={filters.category || ""}
                            onChange={onFilterChange}
                        />
                    </div>
                </div>
            </div>

            <div className="candidateDashboardJobList">
                {jobsToShow.length > 0 ? (
                    jobsToShow.map((job) => {
                        const companyId = companyMap[job.userId];

                        const logoUrl = companyId
                            ? `${API_BASE_URL}/api/company-profile/${companyId}/logo`
                            : "https://via.placeholder.com/50";

                        const isSaved = savedJobs.some(
                            (savedJob) => Number(savedJob.id) === Number(job.id)
                        );

                        const isApplied = applications.some(
                            (application) =>
                                Number(application.jobId || application.job?.id) ===
                                Number(job.id)
                        );

                        return (
                            <div className="candidateDashboardJobCard" key={job.id}>
                                <div className="jobLogo">
                                    <img
                                        src={logoUrl}
                                        alt="logo"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/50";
                                        }}
                                    />
                                </div>

                                <div className="candidateDashboardJobInfo">
                                    <h3>{job.title}</h3>
                                    <p>{job.company}</p>

                                    <span>{job.location}</span>
                                    <span>₹{Number(job.salary).toLocaleString("en-IN")}</span>
                                    <span>{job.category}</span>

                                    <small>{job.description}</small>

                                    <div className="candidateDashboardSkillsWrap">
                                        {job.skills.map((skill, index) => (
                                            <span className="skillTag" key={index}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="candidateDashboardJobActions">
                                    <button
                                        className="bookmarkBtn"
                                        onClick={() => handleSaveJob(job)}
                                        disabled={isSaved}
                                    >
                                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                        {isSaved ? "Saved" : "Save Job"}
                                    </button>

                                    <button
                                        className="mockInterviewBtn"
                                        onClick={() => handleMockInterviewClick(job)}
                                    >
                                        <FaMicrophoneAlt />
                                        Mock Interview
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
                    <div className="candidateDashboardEmptyState">No jobs found</div>
                )}
            </div>
        </div>
    );
};

export default CandidateJobs;