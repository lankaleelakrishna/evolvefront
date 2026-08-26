import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config/api";
import "./InternJobsDetailsPage.css";

import { useNavigate, useParams } from "react-router-dom";

import {
  FaLocationDot,
  FaBriefcase,
} from "react-icons/fa6";

import Footer from "../../../Footer/Footer";
import NavBar from "../../../HomePage/NavBar/NavBar";

const InternJobsDetailsPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternshipDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInternshipDetails = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/aftergrad/${id}`
      );

      const data = await response.json();

      setJob(data);

      if (data.userId) {
        try {
          const companyResponse = await fetch(
            `${API_BASE_URL}/api/company-profile/user/${data.userId}`
          );

          const companyData =
            await companyResponse.json();

          setCompanyId(companyData.id);
        } catch (error) {
          console.error(
            "Company fetch error:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "Internship details error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="intern-details-page">
        <div className="intern-details-notfound">
          Loading internship details...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="intern-details-page">
        <div className="intern-details-notfound">
          Internship job not found
        </div>
      </div>
    );
  }

  const logoUrl = companyId
    ? `${API_BASE_URL}/api/company-profile/${companyId}/logo`
    : "https://via.placeholder.com/100";

  return (
    <>
      <NavBar />

      <div className="intern-details-page">
        <div className="intern-details-wrapper">
          <div className="intern-details-left">
            <div className="intern-details-top-card">
              <div className="intern-details-header">
                <img
                  src={logoUrl}
                  alt={job.compName}
                  className="intern-details-logo"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/100")
                  }
                />

                <div className="intern-details-main-info">
                  <h1>{job.jobTitle}</h1>

                  <p className="intern-details-company">
                    {job.compName}
                  </p>

                  <div className="intern-details-tags">
                    <span className="tag">
                      Internship
                    </span>

                    <span className="tag">
                      {job.expReq
                        ? `${job.expReq}+ years`
                        : "0-1 years"}
                    </span>
                  </div>

                  <div className="intern-details-meta">
                    <span className="salary">
                      ₹
                      {job.salary
                        ? job.salary
                        : "Stipend not disclosed"}
                    </span>

                    <span className="location">
                      <FaLocationDot />
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="intern-details-action">
                  <button
                    className="intern-apply-btn"
                    onClick={() =>
                      navigate("/job-application")
                    }
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            <div className="intern-details-card">
              <h2>Job Description</h2>

              <p>
                {job.jobDescription ||
                  "This internship offers hands-on experience working on real projects."}
              </p>
            </div>

            <div className="intern-details-card">
              <h2>Key Skills</h2>

              <div className="skills-list">
                {(job.reqSkills || "")
                  .split(",")
                  .map((skill, index) => (
                    <span key={index}>
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="intern-details-right">
            <div className="intern-overview-card">
              <h3>Job Overview</h3>

              <div className="overview-item">
                <FaBriefcase />

                <span>
                  {job.jobType ||
                    "Internship"}
                </span>
              </div>

              <div className="overview-item">
                <span>
                  ₹
                  {job.salary
                    ? job.salary
                    : "Stipend not disclosed"}
                </span>
              </div>

              <div className="overview-item">
                <FaLocationDot />

                <span>{job.location}</span>
              </div>

              <p className="posted">
                Posted Recently
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default InternJobsDetailsPage;