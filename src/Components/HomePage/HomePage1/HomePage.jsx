import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";

import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import Footer from "../../Footer/Footer";

import {
  FaLocationDot,
  FaBriefcase,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import heroVideo from "../../../bgvideo/IMG_0710.MP4";

import Testimonials from "../../Pages/Testimonils/Testimonils";
import Internpage from "../../Pages/InternshipPage/Internpage/internpage";

const HomePage = () => {
  const navigate = useNavigate();
  const featuredJobsRef = useRef(null);

  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
    experience: "",
  });

  const [jobs, setJobs] = useState([]);
  const [companyMap, setCompanyMap] = useState({});
  const [candidateCount, setCandidateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    fetchCandidateCount();
  }, []);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);

    setTimeout(() => {
      featuredJobsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/aftergrad/all");
      const data = await response.json();

      const filteredJobs = data.filter(
        (job) => job.jobType === "FULL_TIME" || job.jobType === "PART_TIME"
      );

      setJobs(filteredJobs);

      const map = {};

      await Promise.all(
        filteredJobs.map(async (job) => {
          try {
            const companyResponse = await fetch(
              `http://localhost:8080/api/company-profile/user/${job.userId}`
            );

            const company = await companyResponse.json();
            map[job.userId] = company.id;
          } catch (error) {
            console.error("Company fetch error:", error);
          }
        })
      );

      setCompanyMap(map);
    } catch (error) {
      console.error("Job fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/aftergrad/candidates/count"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch candidate count");
      }

      const data = await response.json();
      setCandidateCount(data);
    } catch (error) {
      console.error("Candidate count fetch error:", error);
      setCandidateCount(0);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !filters.searchTerm ||
      job.jobTitle?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.compName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.reqSkills?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesLocation =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="homepage">
      <NavBar />

      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-badge">EVOLVE JOB PORTAL</span>

            <h1 className="hero-title">
              Find Your
              <span> Dream Job </span>
              Faster
            </h1>

            <p className="hero-subtitle">
              Explore opportunities from top companies, discover roles that
              match your skills, and apply with confidence.
            </p>

            <div className="hero-stats">
              <div className="hero-stat-card">
                <FaBriefcase />
                <div>
                  <h3>{jobs.length}+</h3>
                  <p>Jobs</p>
                </div>
              </div>

              <div className="hero-stat-card">
                <FaBuilding />
                <div>
                  <h3>{Object.keys(companyMap).length}+</h3>
                  <p>Companies</p>
                </div>
              </div>

              <div className="hero-stat-card">
                <FaUserTie />
                <div>
                  <h3>{candidateCount}+</h3>
                  <p>Candidates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-search-box">
            <SearchBar jobsData={jobs} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <div className="jobs-main-container" ref={featuredJobsRef}>
        <section className="featured-section">
          <div className="featured-container">
            <div className="results-header">
              <div className="results-header-left">
                <span className="section-badge">Featured Opportunities</span>

                <h2>Featured Jobs</h2>

                <p className="results-count">
                  {filteredJobs.length} job
                  {filteredJobs.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <div className="jobs-grid">
              {loading ? (
                <div className="no-results">
                  <h3>Loading jobs...</h3>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="no-results">
                  <h3>No jobs found</h3>
                  <p>Try adjusting your search.</p>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const companyId = companyMap[job.userId];

                  const logoUrl = companyId
                    ? `http://localhost:8080/api/company-profile/${companyId}/logo`
                    : "https://via.placeholder.com/100";

                  return (
                    <div className="job-card" key={job.id}>
                      <div className="job-card-top">
                        <div className="job-card-logo-wrap">
                          <img
                            src={logoUrl}
                            alt={job.compName}
                            className="job-card-logo"
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/100")
                            }
                          />
                        </div>
                      </div>

                      <div className="job-card-content">
                        <p className="job-card-title">{job.jobTitle}</p>

                        <p className="job-card-company">{job.compName}</p>

                        <span className="job-type-badge">{job.jobType}</span>

                        <span className="job-card-salary">
                          ₹{job.salary ? job.salary : "Not disclosed"}
                        </span>

                        <p className="job-card-location">
                          <FaLocationDot className="location-icon" />
                          {job.location}
                        </p>
                      </div>

                      <button
                        className="home-apply-btn"
                        onClick={() => navigate(`/job-details/${job.id}`)}
                      >
                        Apply Now
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>

      <Internpage />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;