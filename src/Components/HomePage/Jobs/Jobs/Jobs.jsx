import React, { useState, useEffect } from "react";
import "./Jobs.css";
import Footer from "../../../Footer/Footer";
import { useNavigate } from "react-router-dom";
import NavBar from "../../NavBar/NavBar";
import axios from "axios";

import {
  FaLocationDot,
  FaMoneyBillWave,
  FaBuilding,
  FaUsers,
  FaStar,
  FaBriefcase,
} from "react-icons/fa6";

import { FaSearch } from "react-icons/fa";

const Jobs = () => {

  const navigate = useNavigate();

  const [jobsData, setJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [companyMap, setCompanyMap] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    remote: false,
  });

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/api/aftergrad/all"
      );

      const mappedJobs = response.data.map((job) => ({
        id: job.id,
        jobTitle: job.jobTitle,
        companyName: job.compName,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType,
        reqSkills: job.reqSkills,
        description: job.jobDescription,
        userId: job.userId
      }));

      setJobsData(mappedJobs);
      setFilteredJobs(mappedJobs);

      const uniqueUserIds = [
        ...new Set(mappedJobs.map((j) => j.userId))
      ];

      uniqueUserIds.forEach(fetchCompanyLogo);

    } catch (error) {

      console.error("Error fetching jobs", error);
    }
  };

  const fetchCompanyLogo = async (userId) => {

    try {

      const response = await axios.get(
        `http://localhost:8080/api/company-profile/user/${userId}`
      );

      setCompanyMap((prev) => ({
        ...prev,
        [userId]: response.data.id
      }));

    } catch (error) {

      console.error("Company fetch error:", error);
    }
  };

  const applyFilters = () => {

    let result = [...jobsData];

    if (filters.search.trim()) {

      const term = filters.search.toLowerCase();

      result = result.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(term) ||
          job.companyName?.toLowerCase().includes(term) ||
          job.location?.toLowerCase().includes(term)
      );
    }

    if (filters.location && filters.location !== "open") {

      result = result.filter((job) =>
        job.location
          ?.toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType && filters.jobType !== "open") {

      result = result.filter(
        (job) =>
          job.jobType?.toLowerCase() ===
          filters.jobType.toLowerCase()
      );
    }

    setFilteredJobs(result);

    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, jobsData]);

  const handleFilterChange = (key, value) => {

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {

    setFilters({
      search: "",
      location: "",
      salary: "",
      experience: "",
      jobType: "",
      remote: false,
    });

    setCurrentPage(1);
  };

  const getUniqueLocations = () => {

    const locations = jobsData
      .map((job) => job.location)
      .filter(Boolean);

    return [...new Set(locations)];
  };

  const totalJobs = filteredJobs.length;

  const totalPages =
    Math.ceil(totalJobs / pageSize) || 1;

  const startIndex =
    (currentPage - 1) * pageSize;

  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePageChange = (page) => {

    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderPageNumbers = () => {

    const pages = [];

    for (let p = 1; p <= totalPages; p++) {

      pages.push(

        <button
          key={p}
          className={`jobs-page-btn ${
            currentPage === p ? "active" : ""
          }`}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </button>
      );
    }

    return pages;
  };

  return (

    <div className="jobs-page-wrapper">

      <NavBar />

      <section className="jobs-hero-section">

        <div className="jobs-hero-overlay"></div>

        <div className="jobs-hero-content">

          <span className="jobs-hero-badge">
            Find. Apply. Build Your Future.
          </span>

          <h1>Find Your Dream Job</h1>

          <p>
            Discover thousands of job opportunities
            from top companies and take the next
            step in your career.
          </p>

          <div className="jobs-search-panel">

            <div className="jobs-search-field">

              <FaSearch />

              <input
                type="text"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) =>
                  handleFilterChange(
                    "search",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="jobs-search-location">

              <FaLocationDot />

              <select
                value={filters.location}
                onChange={(e) =>
                  handleFilterChange(
                    "location",
                    e.target.value
                  )
                }
              >

                <option value="open">
                  Location
                </option>

                {getUniqueLocations().map((loc) => (

                  <option key={loc} value={loc}>
                    {loc}
                  </option>

                ))}

              </select>

            </div>

            <button className="jobs-search-button">

              <FaSearch />

              Search Jobs

            </button>

          </div>

        </div>

      </section>

      <section className="jobs-stats-card">

        <div className="jobs-stat-item">

          <div className="jobs-stat-icon">
            <FaBriefcase />
          </div>

          <div>
            <h3>{jobsData.length}+</h3>
            <p>Active Jobs</p>
          </div>

        </div>

        <div className="jobs-stat-item">

          <div className="jobs-stat-icon">
            <FaBuilding />
          </div>

          <div>
            <h3>{Object.keys(companyMap).length}+</h3>
            <p>Top Companies</p>
          </div>

        </div>

        <div className="jobs-stat-item">

          <div className="jobs-stat-icon">
            <FaUsers />
          </div>

          <div>
            <h3>15,000+</h3>
            <p>Candidates Hired</p>
          </div>

        </div>

        <div className="jobs-stat-item">

          <div className="jobs-stat-icon">
            <FaStar />
          </div>

          <div>
            <h3>4.8/5</h3>
            <p>Average Rating</p>
          </div>

        </div>

      </section>

      <main className="jobs-main-layout">

        <section className="jobs-list-section">

          <div className="jobs-filter-tabs">

            <button
              className={
                filters.jobType === "" ||
                filters.jobType === "open"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleFilterChange(
                  "jobType",
                  "open"
                )
              }
            >
              All
            </button>

            <button
              onClick={() =>
                handleFilterChange(
                  "jobType",
                  "FULL_TIME"
                )
              }
            >
              Full Time
            </button>

            <button
              onClick={() =>
                handleFilterChange(
                  "jobType",
                  "PART_TIME"
                )
              }
            >
              Part Time
            </button>

            <button
              onClick={() =>
                handleFilterChange(
                  "jobType",
                  "INTERNSHIP"
                )
              }
            >
              Internship
            </button>

            <button
              onClick={() =>
                handleFilterChange(
                  "jobType",
                  "CONTRACT"
                )
              }
            >
              Contract
            </button>

            {(filters.search ||
              filters.location ||
              filters.jobType) && (

              <button
                className="clear-filter-tab"
                onClick={clearAllFilters}
              >
                Clear
              </button>
            )}

          </div>

          <div className="jobs-list">

            {currentJobs.length > 0 ? (

              currentJobs.map((job, idx) => {

                const companyId = companyMap[job.userId];

                const logoUrl = companyId
                  ? `http://localhost:8080/api/company-profile/${companyId}/logo`
                  : "https://via.placeholder.com/50";

                return (

                  <div
                    className="jobs-card"
                    key={idx}
                  >

                    <div className="jobs-logo">

                      <img
                        src={logoUrl}
                        alt="company-logo"
                      />

                    </div>

                    <div className="jobs-info">

                      <h3 className="jobs-title">
                        {job.jobTitle}
                      </h3>

                      <div className="jobs-company-row">

                        <span>
                          {job.companyName}
                        </span>

                        <b>•</b>

                        <span>
                          {job.jobType}
                        </span>

                      </div>

                      <div className="jobs-meta">

                        <span>
                          <FaLocationDot />
                          {job.location}
                        </span>

                        <span>
                          <FaMoneyBillWave />
                          ₹{job.salary}
                        </span>

                      </div>

                    </div>

                    <div className="jobs-tags">

                      {job.reqSkills
                        ? job.reqSkills
                            .split(",")
                            .map((skill, index) => (

                              <span key={index}>
                                {skill.trim()}
                              </span>

                            ))
                        : (
                          <span>No Skills</span>
                        )}

                    </div>

                    <div className="jobs-actions">

                      <button
                        className="jobs-apply-btn"
                        onClick={() =>
                          navigate(
                            `/job-details/${job.id}`
                          )
                        }
                      >
                        Apply Now
                      </button>

                    </div>

                  </div>
                );
              })

            ) : (

              <div className="jobs-empty-state">

                <h3>No jobs found</h3>

                <p>
                  Try changing the filters.
                </p>

              </div>
            )}

          </div>

          {currentJobs.length > 0 && (

            <div className="jobs-pagination">

              <button
                className="jobs-nav-btn"
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {renderPageNumbers()}

              <button
                className="jobs-nav-btn"
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>

            </div>
          )}

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default Jobs;