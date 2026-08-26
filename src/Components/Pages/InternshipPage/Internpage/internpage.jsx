import React, { useEffect, useState } from "react";
import "./Internpage.css";

import {
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Internpage = () => {
  const navigate = useNavigate();

  const [internshipJobs, setInternshipJobs] =
    useState([]);

  const [companyMap, setCompanyMap] =
    useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/aftergrad/internships"
      );

      const data = await response.json();

      setInternshipJobs(data);

      const map = {};

      await Promise.all(
        data.map(async (job) => {
          try {
            const companyResponse = await fetch(
              `http://localhost:8080/api/company-profile/user/${job.userId}`
            );

            const company =
              await companyResponse.json();

            map[job.userId] = company.id;
          } catch (error) {
            console.error(
              "Company fetch error:",
              error
            );
          }
        })
      );

      setCompanyMap(map);
    } catch (error) {
      console.error(
        "Internship fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="internpage-section">
        <div className="internpage-container">
          <p className="internpage-empty">
            Loading internships...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="internpage-section">
      <div className="internpage-container">
        <div className="internpage-header">
          <span className="internpage-badge">
            Internship Opportunities
          </span>

          <h2>
            Explore Latest Internships
          </h2>

          <p>
            Discover the best internship openings
            from top companies and start building
            your career with real-world experience.
          </p>
        </div>

        <div className="internpage-grid">
          {internshipJobs.length > 0 ? (
            internshipJobs.map((job) => {
              const companyId =
                companyMap[job.userId];

              const logoUrl = companyId
                ? `http://localhost:8080/api/company-profile/${companyId}/logo`
                : "https://via.placeholder.com/100";

              return (
                <div
                  className="internpage-card"
                  key={job.id}
                  onClick={() =>
                    navigate(
                      `/internjobdetails/${job.id}`
                    )
                  }
                >
                  <div className="internpage-card-top">
                    <div className="internpage-logo-box">
                      <img
                        src={logoUrl}
                        alt={job.compName}
                        className="internpage-logo"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/100")
                        }
                      />
                    </div>

                    <span className="internpage-type-badge">
                      Internship
                    </span>
                  </div>

                  <div className="internpage-card-content">
                    <h3 className="internpage-role">
                      {job.jobTitle}
                    </h3>

                    <p className="internpage-company">
                      {job.compName}
                    </p>

                    <div className="internpage-salary">
                      ₹
                      {job.salary
                        ? job.salary
                        : "Stipend not disclosed"}
                    </div>

                    <div className="internpage-location">
                      <FaMapMarkerAlt className="internpage-location-icon" />

                      <span>{job.location}</span>
                    </div>
                  </div>

                  <button
                    className="internpage-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate(
                        `/internjobdetails/${job.id}`
                      );
                    }}
                  >
                    Apply Now

                    <FaArrowRight />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="internpage-empty">
              No internship jobs available
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Internpage;