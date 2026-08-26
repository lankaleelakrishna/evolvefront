import React, { useState, useEffect } from "react";
import "./JobDetailsPage.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaBriefcase,
  FaMoneyBillWave,
  FaBookmark,
  FaArrowLeft,
  FaBuilding,
  FaCheckCircle,
  FaRobot,
} from "react-icons/fa";

import Footer from "../Footer/Footer";
import NavBar from "../HomePage/NavBar/NavBar";

const JobDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [companyId, setCompanyId] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/aftergrad/${id}`
      );

      const data = response.data;

      const mappedJob = {
        id: data.id,
        title: data.jobTitle,
        company: data.compName,
        location: data.location,
        salary: data.salary,
        type: data.jobType,
        description: data.jobDescription,
        skills: data.reqSkills ? data.reqSkills.split(",") : [],
        userId: data.userId,
      };

      setJob(mappedJob);

      fetchCompanyLogo(data.userId);

      const existingJobs =
        JSON.parse(localStorage.getItem("savedJobs")) || [];

      const alreadySaved = existingJobs.find(
        (j) => String(j.id) === String(data.id)
      );

      setIsSaved(!!alreadySaved);
    } catch (error) {
      console.error("Error fetching job details", error);
    }
  };

  const fetchCompanyLogo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/company-profile/user/${userId}`
      );

      setCompanyId(response.data.id);
    } catch (error) {
      console.error("Company logo fetch error", error);
    }
  };

  const handleSaveJob = async () => {
    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    if (!token) {
      toast.warning("Login required to save jobs", {
        autoClose: false,
        closeOnClick: true,
        hideProgressBar: true,
        theme: "light",
      });

      navigate("/login/candidate");

      return;
    }

    if (role?.toLowerCase() !== "candidate") {
      toast.warning("Only candidates can save jobs", {
        autoClose: false,
        closeOnClick: true,
        hideProgressBar: true,
        theme: "light",
      });

      return;
    }

    try {
      if (!job) return;

      const userId = localStorage.getItem("userId");

      await axios.post(
        "http://localhost:8080/api/saved-jobs",
        {
          userId: userId,
          jobId: job.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(true);

      toast.success("Job saved successfully", {
        autoClose: false,
        closeOnClick: true,
        hideProgressBar: true,
        theme: "light",
      });
    } catch (error) {
      console.error("SAVE ERROR:", error);

      if (error.response?.data) {
        toast.error(error.response.data, {
          autoClose: false,
          closeOnClick: true,
          hideProgressBar: true,
          theme: "light",
        });
      } else {
        toast.error("Failed to save job", {
          autoClose: false,
          closeOnClick: true,
          hideProgressBar: true,
          theme: "light",
        });
      }
    }
  };

  const handleApplyNow = () => {
    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    if (!token) {
      toast.info("Login required to apply for jobs", {
        autoClose: false,
        closeOnClick: true,
        hideProgressBar: true,
        theme: "light",
      });

      navigate("/login/candidate");

      return;
    }

    if (role?.toLowerCase() !== "candidate") {
      toast.warning("Only candidates can apply for jobs", {
        autoClose: false,
        closeOnClick: true,
        hideProgressBar: true,
        theme: "light",
      });

      return;
    }

    navigate("/job-application", {
      state: {
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company,
      },
    });
  };

  const handleMockInterview = () => {
    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    if (!token) {
      toast.info("Login required to start mock interview", {
        autoClose: false,
        closeOnClick: true,
        hideProgressBar: true,
        theme: "light",
      });

      navigate("/login/candidate");

      return;
    }

    if (role?.toLowerCase() !== "candidate") {
      toast.warning("Only candidates can start mock interview", {
        autoClose: false,
        closeOnClick: true,
        hideProgressBar: true,
        theme: "light",
      });

      return;
    }

    navigate(`/mock-interview/${job.id}`);
  };

  if (!job) {
    return (
      <>
        <NavBar />

        <div className="jobDetailsPage">
          <div className="jobDetailsNotFound">
            <h2>Job Not Found</h2>

            <p>
              The job you are looking for is not available.
            </p>

            <button onClick={() => navigate("/jobs")}>
              Go to Jobs
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  const logoUrl = companyId
    ? `http://localhost:8080/api/company-profile/${companyId}/logo`
    : "https://via.placeholder.com/80";

  return (
    <>
      <NavBar />

      <div className="jobDetailsPage">
        <div className="jobDetailsContainer">
          <button
            className="jobDetailsBackBtn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back to Jobs
          </button>

          <div className="jobDetailsHeroCard">
            <div className="jobDetailsHeroLeft">
              <div className="jobDetailsLogoBox">
                <img
                  src={logoUrl}
                  alt={job.company}
                />
              </div>

              <div>
                <span className="jobDetailsStatusBadge">
                  <FaCheckCircle />
                  Actively Hiring
                </span>

                <h1>{job.title}</h1>

                <p className="jobDetailsCompany">
                  {job.company}
                </p>

                <div className="jobDetailsMetaRow">
                  <span>
                    <FaMoneyBillWave />
                    ₹{job.salary}
                  </span>

                  <span>
                    <FaBriefcase />
                    {job.type}
                  </span>

                  <span>
                    <FaLocationDot />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="jobDetailsHeroActions">
              <button
                className="jobDetailsApplyBtn"
                onClick={handleApplyNow}
              >
                Apply Now
              </button>

              <button
                className="jobDetailsMockBtn"
                onClick={handleMockInterview}
              >
                <FaRobot />
                Start Mock Interview
              </button>

              <button
                className="jobDetailsSaveBtn"
                onClick={handleSaveJob}
              >
                <FaBookmark />
                {isSaved ? "Saved" : "Save Job"}
              </button>
            </div>
          </div>

          <div className="jobDetailsMainGrid">
            <div className="jobDetailsLeftContent">
              <div className="jobDetailsCard">
                <h2>Job Description</h2>

                <p>
                  {job.description ||
                    "Description not available."}
                </p>
              </div>

              <div className="jobDetailsCard">
                <h2>Key Skills</h2>

                <div className="jobDetailsSkills">
                  {job.skills.length > 0 ? (
                    job.skills.map((skill, index) => (
                      <span key={index}>
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="jobDetailsEmptyText">
                      No skills available.
                    </p>
                  )}
                </div>
              </div>

              {/* <div className="jobDetailsCard">
                <h2>Why Apply?</h2>

                <div className="jobDetailsBenefits">
                  <div>
                    <FaCheckCircle />
                    <span>
                      Good career growth opportunity
                    </span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>
                      Professional work environment
                    </span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>
                      Apply easily through AfterGraduate
                    </span>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="jobDetailsRightContent">
              <div className="jobDetailsCard stickyOverview">
                <h2>Job Overview</h2>

                <div className="jobDetailsOverviewItem">
                  <span>
                    <FaBuilding />
                    Company
                  </span>

                  <strong>{job.company}</strong>
                </div>

                <div className="jobDetailsOverviewItem">
                  <span>
                    <FaLocationDot />
                    Location
                  </span>

                  <strong>{job.location}</strong>
                </div>

                <div className="jobDetailsOverviewItem">
                  <span>
                    <FaMoneyBillWave />
                    Salary
                  </span>

                  <strong>
                    ₹{job.salary}
                  </strong>
                </div>

                <div className="jobDetailsOverviewItem">
                  <span>
                    <FaBriefcase />
                    Type
                  </span>

                  <strong>{job.type}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JobDetailsPage;