import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaRegCalendarAlt,
  FaFileAlt,
  FaTimes,
  FaUpload,
  FaCheckCircle,
} from "react-icons/fa";
import "./CandidateDashBoards.css";

import CandidateSidebar from "./CandidateSidebar/CandidateSidebar";
import CandidateProfile from "./CandidateProfile/CandidateProfile";
import CandidateResume from "./CandidateResume/CandidateResume";
import CandidateJobs from "./CandidateJobs/CandidateJobs";
import CandidateSavedJobs from "./CandidateSavedJobs/CandidateSavedJobs";
import CandidateApplications from "./CandidateApplications/CandidateApplications";
import CandidateMockInterviewResult from "./CandidateMockInterviewResult/CandidateMockInterviewResult";
import NavBar from "../../HomePage/NavBar/NavBar";

const CandidateDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("profile");

  const [candidateProfile, setCandidateProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    category: "",
    about: "",
    experienceLevel: "",
    yearsOfExperience: "",
    salaryExpectation: "",
    preferredLocation: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const [selectedResumeType, setSelectedResumeType] = useState("");
  const [builderResumeFile, setBuilderResumeFile] = useState(null);
  const [resumeBuildLoading, setResumeBuildLoading] = useState(false);
  const [resumeBuildMessage, setResumeBuildMessage] = useState("");
  const [generatedResumeUrl, setGeneratedResumeUrl] = useState("");

  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    savedJobs: 0,
    appliedJobs: 0,
    underReview: 0,
  });

  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    salary: "",
    skills: "",
    category: "",
  });

  const [userName, setUserName] = useState("User");

  const resumeTypes = [
    {
      type: "basic",
      title: "Basic",
      desc: "Simple ATS-friendly resume for freshers.",
    },
    {
      type: "standard",
      title: "Standard",
      desc: "Professional resume with better formatting.",
    },
    {
      type: "advanced",
      title: "Advanced",
      desc: "AI-enhanced resume with strong profile summary.",
    },
  ];

  const mapSavedJob = (item) => ({
    id: item.id,
    title: item.jobTitle,
    company: item.compName,
    location: item.location,
    salary: item.salary,
    category: item.jobType,
    description: item.jobDescription,
    userId: item.companyUserId || item.userId,
  });

  const fetchSavedJobs = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || userId === "undefined") return;

    fetch(`http://localhost:8080/api/saved-jobs/${userId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = Array.isArray(data) ? data.map(mapSavedJob) : [];
        setSavedJobs(mapped);
      })
      .catch((err) => console.error("Error fetching saved jobs:", err));
  };

  const fetchApplications = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || userId === "undefined") return;

    fetch(`http://localhost:8080/application/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching applications:", err));
  };

  useEffect(() => {
    fetchApplications();
    fetchSavedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("name") || "User";
    setUserName(storedName);
  }, []);

  const handleSidebarChange = (menu) => {
    setActiveMenu(menu);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setCandidateProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    setActiveMenu("jobs");
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setResumeFile(file);
    }
  };

  const handleBuilderResumeFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBuilderResumeFile(file);
      setResumeBuildMessage("");
      setGeneratedResumeUrl("");
    }
  };

  const handleResumeTypeClick = (type) => {
    setSelectedResumeType(type);
    setResumeBuildMessage("");
    setGeneratedResumeUrl("");
  };

  const closeResumeBuilder = () => {
    setIsResumeBuilderOpen(false);
    setSelectedResumeType("");
    setBuilderResumeFile(null);
    setResumeBuildMessage("");
    setResumeBuildLoading(false);
    setGeneratedResumeUrl("");
  };

  const handleDownloadGeneratedResume = async (fileName) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/resume/download/${fileName}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      setResumeBuildMessage("Resume generated, but download failed.");
    }
  };

  const handleBuildResume = async () => {
    if (!selectedResumeType) {
      setResumeBuildMessage("Please select resume type.");
      return;
    }

    if (!builderResumeFile) {
      setResumeBuildMessage("Please upload PDF or DOCX resume.");
      return;
    }

    const candidateId =
      localStorage.getItem("candidateId") || localStorage.getItem("userId");
    const email =
      localStorage.getItem("userEmail") ||
      localStorage.getItem("email") ||
      candidateProfile.email;

    const token = localStorage.getItem("token");

    if (!candidateId || !email) {
      setResumeBuildMessage("Candidate details not found. Please login again.");
      return;
    }

    try {
      setResumeBuildLoading(true);
      setResumeBuildMessage("");
      setGeneratedResumeUrl("");

      const formData = new FormData();
      formData.append("file", builderResumeFile);
      formData.append("candidateId", candidateId);
      formData.append("email", email);
      formData.append("resumeType", selectedResumeType);
      formData.append("templateName", `${selectedResumeType}-template`);

      const response = await fetch("http://localhost:8080/api/resume/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Resume build failed");
      }

      const data = await response.json();
      console.log("Resume response:", data);

      if (data.generatedResumeUrl) {
        setGeneratedResumeUrl(data.generatedResumeUrl);
      }

      setResumeBuildMessage("Resume built successfully.");
    } catch (error) {
      console.error("Resume build error:", error);
      setResumeBuildMessage("Something went wrong while building resume.");
    } finally {
      setResumeBuildLoading(false);
    }
  };

  const fetchDashboardCounts = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || userId === "undefined") {
      return;
    }

    fetch(`http://localhost:8080/api/dashboard/counts/${userId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("API response not OK");
        }

        return res.json();
      })
      .then((data) => {
        setDashboardData({
          totalJobs: data.availableJobs || 0,
          savedJobs: data.savedJobs || 0,
          appliedJobs: data.applications || 0,
          underReview: data.shortlisted || 0,
        });
      })
      .catch((err) => console.log("Dashboard API error:", err));
  };

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  const handleSaveJob = () => {
    fetchSavedJobs();
    fetchDashboardCounts();
  };

  const handleApplyJob = async (job) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8080/application/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          userId: Number(userId),
          jobId: job.id,
        }),
      });

      fetchApplications();
      fetchDashboardCounts();
    } catch (err) {
      console.error("Apply error:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const summaryCards = [
    {
      title: "Available Jobs",
      value: dashboardData.totalJobs,
      className: "blueCard",
    },
    {
      title: "Saved jobs",
      value: dashboardData.savedJobs,
      className: "purpleCard",
    },
    {
      title: "Jobs applied",
      value: dashboardData.appliedJobs,
      className: "greenCard",
    },
    {
      title: "Shortlisted",
      value: dashboardData.underReview,
      className: "orangeCard",
    },
  ];

  const renderPage = () => {
    switch (activeMenu) {
      case "profile":
        return (
          <CandidateProfile
            candidateProfile={candidateProfile}
            onProfileChange={handleProfileChange}
            onSaveProfile={handleSaveProfile}
            setCandidateProfile={setCandidateProfile}
          />
        );

      case "resume":
        return (
          <CandidateResume
            resumeFile={resumeFile}
            onResumeUpload={handleResumeUpload}
          />
        );

      case "jobs":
        return (
          <CandidateJobs
            filters={filters}
            onFilterChange={handleFilterChange}
            applications={applications}
            savedJobs={savedJobs}
            onSaveJob={handleSaveJob}
            onApplyJob={handleApplyJob}
          />
        );

      case "saved":
        return (
          <CandidateSavedJobs
            savedJobs={savedJobs}
            applications={applications}
            onSaveJob={handleSaveJob}
            onApplyJob={handleApplyJob}
          />
        );

      case "applications":
        return <CandidateApplications applications={applications} />;

      case "mockResult":
        return <CandidateMockInterviewResult />;

      default:
        return null;
    }
  };

  return (
    <>
      <NavBar />

      <div className="CandidateDashBoardsLayout">
        <CandidateSidebar
          activeMenu={activeMenu}
          onChangeMenu={handleSidebarChange}
        />

        <main className="CandidateDashBoardsMainContent">
          <div className="CandidateDashBoardsTopbar">
            <div>
              <h2>Welcome, {userName}</h2>
              <p>Manage your profile, jobs and applications</p>

              <button
                className="CandidateResumeBuildBtn"
                onClick={() => setIsResumeBuilderOpen(true)}
              >
                <FaFileAlt />
                Build Your Resume
              </button>
            </div>

            <div className="CandidateDashBoardsTopbarRight">
              <button className="CandidateDashBoardsIconBtn">
                <FaBell />
              </button>

              <button className="CandidateDashBoardsDateBtn">
                <FaRegCalendarAlt />
                <span>Today</span>
              </button>
            </div>
          </div>

          <div className="CandidateDashBoardsCardsGrid">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className={`CandidateDashBoardsSummaryCard ${card.className}`}
              >
                <h3>{card.title}</h3>
                <h2>{card.value}</h2>
              </div>
            ))}
          </div>

          <div className="CandidateDashBoardsSections">{renderPage()}</div>  
        </main>
      </div>

      {isResumeBuilderOpen && (
        <div className="CandidateResumeBuilderOverlay">
          <div className="CandidateResumeBuilderModal">
            <button
              className="CandidateResumeBuilderClose"
              onClick={closeResumeBuilder}
            >
              <FaTimes />
            </button>

            <div className="CandidateResumeBuilderHeader">
              <div className="CandidateResumeBuilderIcon">
                <FaFileAlt />
              </div>
              <div>
                <h2>Build Your Resume</h2>
                <p>Select resume type and upload your existing resume.</p>
              </div>
            </div>

            <div className="CandidateResumeTypeGrid">
              {resumeTypes.map((item) => (
                <button
                  key={item.type}
                  className={`CandidateResumeTypeCard ${
                    selectedResumeType === item.type ? "active" : ""
                  }`}
                  onClick={() => handleResumeTypeClick(item.type)}
                >
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {selectedResumeType === item.type && <FaCheckCircle />}
                </button>
              ))}
            </div>

            {selectedResumeType && (
              <div className="CandidateResumeUploadBox">
                <label>
                  <FaUpload />
                  <span>
                    {builderResumeFile
                      ? builderResumeFile.name
                      : "Upload PDF or DOCX resume"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleBuilderResumeFile}
                  />
                </label>
              </div>
            )}

            {resumeBuildMessage && (
              <p className="CandidateResumeBuildMessage">
                {resumeBuildMessage}
              </p>
            )}

            {generatedResumeUrl && (
              <button
                className="CandidateResumeDownloadBtn"
                onClick={() =>
                  handleDownloadGeneratedResume(generatedResumeUrl)
                }
              >
                Download Generated Resume
              </button>
            )}

            <button
              className="CandidateResumeGenerateBtn"
              onClick={handleBuildResume}
              disabled={resumeBuildLoading}
            >
              {resumeBuildLoading ? "Building Resume..." : "Generate Resume"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateDashboard;