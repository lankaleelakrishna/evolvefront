import React, { useMemo, useState } from "react";
import {
    FaUser,
    FaFilePdf,
    FaSearch,
    FaBookmark,
    FaRegBookmark,
    FaBriefcase,
    FaClipboardList,
    FaBell,
    FaRegCalendarAlt,
    FaSave,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaTools,
    FaLayerGroup,
} from "react-icons/fa";
import "./CandidateDashboard.css";

const CandidateDashboard = () => {
    const [activeMenu, setActiveMenu] = useState("profile");

    const [candidateProfile, setCandidateProfile] = useState({
        fullName: "Pradeep Varma",
        email: "pradeep@gmail.com",
        phone: "+91 9876543210",
        location: "Hyderabad",
        skills: "React, JavaScript, CSS, HTML, Node.js",
        experience: "2 Years",
        category: "Frontend Developer",
        about:
            "Passionate frontend developer looking for exciting opportunities in product-based companies.",
    });

    const [resumeFile, setResumeFile] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        location: "",
        salary: "",
        skills: "",
        category: "",
    });

    const [jobs, setJobs] = useState([
        {
            id: 1,
            title: "Frontend Developer",
            company: "Google",
            location: "Hyderabad",
            salary: "600000",
            skills: ["React", "JavaScript", "CSS"],
            category: "Frontend Developer",
            description: "Build scalable UI applications using React.",
        },
        {
            id: 2,
            title: "Backend Developer",
            company: "Microsoft",
            location: "Bangalore",
            salary: "800000",
            skills: ["Node.js", "Express", "MongoDB"],
            category: "Backend Developer",
            description: "Develop APIs and backend services for enterprise apps.",
        },
        {
            id: 3,
            title: "UI UX Designer",
            company: "Adobe",
            location: "Remote",
            salary: "550000",
            skills: ["Figma", "Adobe XD", "Wireframing"],
            category: "Designer",
            description: "Design modern and user-friendly interfaces.",
        },
        {
            id: 4,
            title: "Full Stack Developer",
            company: "Amazon",
            location: "Hyderabad",
            salary: "900000",
            skills: ["React", "Node.js", "MongoDB"],
            category: "Full Stack Developer",
            description: "Work across frontend and backend systems.",
        },
        {
            id: 5,
            title: "Software Engineer",
            company: "Infosys",
            location: "Chennai",
            salary: "500000",
            skills: ["Java", "Spring Boot", "SQL"],
            category: "Software Engineer",
            description: "Develop and maintain large-scale software products.",
        },
    ]);

    const [savedJobs, setSavedJobs] = useState([]);
    const [applications, setApplications] = useState([
        {
            id: 101,
            jobId: 2,
            title: "Backend Developer",
            company: "Microsoft",
            status: "Under Review",
            appliedDate: "20 Apr 2026",
        },
        {
            id: 102,
            jobId: 3,
            title: "UI UX Designer",
            company: "Adobe",
            status: "Shortlisted",
            appliedDate: "18 Apr 2026",
        },
    ]);

    const handleSidebarChange = (menu) => {
        setActiveMenu(menu);
    };

    const handleProfileChange = (e) => {
        setCandidateProfile({
            ...candidateProfile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        alert("Profile updated successfully!");
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload PDF file only.");
            return;
        }

        setResumeFile(file);
        alert("Resume uploaded successfully!");
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveJob = (job) => {
        const alreadySaved = savedJobs.some((savedJob) => savedJob.id === job.id);

        if (alreadySaved) {
            setSavedJobs((prev) => prev.filter((savedJob) => savedJob.id !== job.id));
        } else {
            setSavedJobs((prev) => [...prev, job]);
        }
    };

    const handleApplyJob = (job) => {
        const alreadyApplied = applications.some(
            (application) => application.jobId === job.id
        );

        if (alreadyApplied) {
            alert("You already applied for this job.");
            return;
        }

        const newApplication = {
            id: Date.now(),
            jobId: job.id,
            title: job.title,
            company: job.company,
            status: "Applied",
            appliedDate: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        };

        setApplications((prev) => [newApplication, ...prev]);
        alert("Job applied successfully!");
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch =
                job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                job.company.toLowerCase().includes(filters.search.toLowerCase());

            const matchesLocation = filters.location
                ? job.location.toLowerCase().includes(filters.location.toLowerCase())
                : true;

            const matchesSalary = filters.salary
                ? Number(job.salary) >= Number(filters.salary)
                : true;

            const matchesSkills = filters.skills
                ? job.skills.some((skill) =>
                    skill.toLowerCase().includes(filters.skills.toLowerCase())
                )
                : true;

            const matchesCategory = filters.category
                ? job.category.toLowerCase().includes(filters.category.toLowerCase())
                : true;

            return (
                matchesSearch &&
                matchesLocation &&
                matchesSalary &&
                matchesSkills &&
                matchesCategory
            );
        });
    }, [jobs, filters]);

    const filteredApplications = useMemo(() => {
        return applications.filter(
            (application) =>
                application.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                application.company
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                application.status.toLowerCase().includes(filters.search.toLowerCase())
        );
    }, [applications, filters.search]);

    const analytics = useMemo(() => {
        return {
            totalJobs: jobs.length,
            savedJobs: savedJobs.length,
            appliedJobs: applications.length,
            shortlistedJobs: applications.filter(
                (application) => application.status === "Shortlisted"
            ).length,
            reviewJobs: applications.filter(
                (application) => application.status === "Under Review"
            ).length,
        };
    }, [jobs, savedJobs, applications]);

    const summaryCards = [
        {
            title: "Available Jobs",
            value: analytics.totalJobs,
            subText: "Jobs in portal",
            className: "blueCard",
        },
        {
            title: "Saved Jobs",
            value: analytics.savedJobs,
            subText: "Bookmarked jobs",
            className: "purpleCard",
        },
        {
            title: "Applications",
            value: analytics.appliedJobs,
            subText: "Jobs applied",
            className: "greenCard",
        },
        {
            title: "Shortlisted",
            value: analytics.shortlistedJobs,
            subText: `${analytics.reviewJobs} under review`,
            className: "orangeCard",
        },
    ];

    const renderProfileSection = () => {
        return (
            <div className="candidateDashboardSectionCard">
                <div className="candidateDashboardSectionHeader">
                    <h2>Create and Update Profile</h2>
                </div>

                <form
                    className="candidateDashboardFormGrid"
                    onSubmit={handleSaveProfile}
                >
                    <div className="candidateDashboardFormGroup">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={candidateProfile.fullName}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardFormGroup">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={candidateProfile.email}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardFormGroup">
                        <label>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={candidateProfile.phone}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardFormGroup">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={candidateProfile.location}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardFormGroup">
                        <label>Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={candidateProfile.skills}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardFormGroup">
                        <label>Experience</label>
                        <input
                            type="text"
                            name="experience"
                            value={candidateProfile.experience}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardFormGroup fullWidth">
                        <label>Job Category</label>
                        <input
                            type="text"
                            name="category"
                            value={candidateProfile.category}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardFormGroup fullWidth">
                        <label>About</label>
                        <textarea
                            rows="5"
                            name="about"
                            value={candidateProfile.about}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="candidateDashboardButtonRow fullWidth">
                        <button type="submit" className="saveBtn">
                            <FaSave /> Save Profile
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    const renderResumeSection = () => {
        return (
            <div className="candidateDashboardSectionCard">
                <div className="candidateDashboardSectionHeader">
                    <h2>Upload Resume (PDF)</h2>
                </div>

                <div className="candidateDashboardResumeBox">
                    <label className="candidateDashboardUploadLabel">
                        <FaFilePdf />
                        <span>Choose Resume PDF</span>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleResumeUpload}
                            hidden
                        />
                    </label>

                    {resumeFile && (
                        <div className="candidateDashboardResumePreview">
                            <h3>Uploaded Resume</h3>
                            <p>{resumeFile.name}</p>
                            <span>
                                {(resumeFile.size / 1024).toFixed(2)} KB • PDF Document
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderJobsSection = () => {
        return (
            <div className="candidateDashboardSectionCard">
                <div className="candidateDashboardSectionHeader">
                    <h2>Search Jobs Using Filters</h2>
                    <span className="candidateDashboardSectionCount">
                        Total: {filteredJobs.length}
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
                                value={filters.search}
                                onChange={handleFilterChange}
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
                                value={filters.location}
                                onChange={handleFilterChange}
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
                                value={filters.salary}
                                onChange={handleFilterChange}
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
                                value={filters.skills}
                                onChange={handleFilterChange}
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
                                value={filters.category}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="candidateDashboardJobList">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => {
                            const isSaved = savedJobs.some((savedJob) => savedJob.id === job.id);
                            const isApplied = applications.some(
                                (application) => application.jobId === job.id
                            );

                            return (
                                <div className="candidateDashboardJobCard" key={job.id}>
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
                                        >
                                            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                            {isSaved ? "Saved" : "Save Job"}
                                        </button>

                                        <button
                                            className="applyBtn"
                                            onClick={() => handleApplyJob(job)}
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

    const renderSavedJobsSection = () => {
        return (
            <div className="candidateDashboardSectionCard">
                <div className="candidateDashboardSectionHeader">
                    <h2>Save Jobs (Bookmark)</h2>
                    <span className="candidateDashboardSectionCount">
                        Total: {savedJobs.length}
                    </span>
                </div>

                <div className="candidateDashboardJobList">
                    {savedJobs.length > 0 ? (
                        savedJobs.map((job) => {
                            const isApplied = applications.some(
                                (application) => application.jobId === job.id
                            );

                            return (
                                <div className="candidateDashboardJobCard" key={job.id}>
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
                                            onClick={() => handleSaveJob(job)}
                                        >
                                            <FaBookmark /> Remove Saved
                                        </button>

                                        <button
                                            className="applyBtn"
                                            onClick={() => handleApplyJob(job)}
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
                        <div className="candidateDashboardEmptyState">No saved jobs found</div>
                    )}
                </div>
            </div>
        );
    };

    const renderApplicationsSection = () => {
        return (
            <div className="candidateDashboardSectionCard">
                <div className="candidateDashboardSectionHeader">
                    <h2>Track Application Status</h2>
                    <span className="candidateDashboardSectionCount">
                        Total: {filteredApplications.length}
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
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((application) => (
                                    <tr key={application.id}>
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

    return (
        <div className="candidateDashboardLayout">
            <aside className="candidateDashboardSidebar">
                <div className="candidateDashboardSidebarTop">
                    <div className="candidateDashboardLogoBox">
                        <div className="candidateDashboardLogoIcon">C</div>
                        <div>
                            <h2 className="candidateDashboardLogoText">Candidate Panel</h2>
                            <p className="candidateDashboardLogoSubtext">Job Portal</p>
                        </div>
                    </div>

                    <ul className="candidateDashboardSidebarMenu">
                        <li
                            className={activeMenu === "profile" ? "active" : ""}
                            onClick={() => handleSidebarChange("profile")}
                        >
                            <FaUser />
                            <span>Profile</span>
                        </li>

                        <li
                            className={activeMenu === "resume" ? "active" : ""}
                            onClick={() => handleSidebarChange("resume")}
                        >
                            <FaFilePdf />
                            <span>Upload Resume</span>
                        </li>

                        <li
                            className={activeMenu === "jobs" ? "active" : ""}
                            onClick={() => handleSidebarChange("jobs")}
                        >
                            <FaSearch />
                            <span>Search Jobs</span>
                        </li>

                        <li
                            className={activeMenu === "saved" ? "active" : ""}
                            onClick={() => handleSidebarChange("saved")}
                        >
                            <FaBookmark />
                            <span>Saved Jobs</span>
                        </li>

                        <li
                            className={activeMenu === "applications" ? "active" : ""}
                            onClick={() => handleSidebarChange("applications")}
                        >
                            <FaClipboardList />
                            <span>Application Status</span>
                        </li>
                    </ul>
                </div>

                <div className="candidateDashboardSidebarBottom">
                    <div className="candidateDashboardAdminProfile">
                        <div className="candidateDashboardAdminAvatar">CV</div>
                        <div>
                            <h4>Candidate</h4>
                            <p>Job Seeker</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="candidateDashboardMainContent">
                <div className="candidateDashboardTopbar">
                    <div>
                        <h1>Candidate Dashboard</h1>
                        <p>Manage your profile, resume, jobs, and applications</p>
                    </div>

                    <div className="candidateDashboardTopbarRight">
                        <button className="candidateDashboardIconBtn">
                            <FaBell />
                        </button>

                        <button className="candidateDashboardDateBtn">
                            <FaRegCalendarAlt />
                            <span>Today</span>
                        </button>
                    </div>
                </div>

                <div className="candidateDashboardCardsGrid">
                    {summaryCards.map((card, index) => (
                        <div
                            className={`candidateDashboardSummaryCard ${card.className}`}
                            key={index}
                        >
                            <h3>{card.title}</h3>
                            <h2>{card.value}</h2>
                            <p>{card.subText}</p>
                        </div>
                    ))}
                </div>

                <div className="candidateDashboardSections">
                    {activeMenu === "profile" && renderProfileSection()}
                    {activeMenu === "resume" && renderResumeSection()}
                    {activeMenu === "jobs" && renderJobsSection()}
                    {activeMenu === "saved" && renderSavedJobsSection()}
                    {activeMenu === "applications" && renderApplicationsSection()}
                </div>
            </main>
        </div>
    );
};

export default CandidateDashboard;