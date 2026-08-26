import React, { useEffect, useState } from "react";

import { API_BASE_URL } from "../../../config/api";
import "./InternshipPage.css";

import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import Internshipjobs from "./Internshipjobs/Internshipjobs";

export default function InternshipPage() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [internships, setInternships] =
    useState([]);

  const [companies, setCompanies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const internshipResponse = await fetch(
        `${API_BASE_URL}/api/aftergrad/internships`
      );

      const internshipData =
        await internshipResponse.json();

      setInternships(internshipData);

      const uniqueCompanies = [];

      const map = new Map();

      await Promise.all(
        internshipData.map(async (item) => {
          try {
            const companyResponse = await fetch(
              `${API_BASE_URL}/api/company-profile/user/${item.userId}`
            );

            const company =
              await companyResponse.json();

            if (!map.has(company.id)) {
              map.set(company.id, true);

              uniqueCompanies.push({
                id: company.id,

                name:
                  company.companyName ||
                  item.compName,

                logo: `${API_BASE_URL}/api/company-profile/${company.id}/logo`,
              });
            }
          } catch (error) {
            console.error(
              "Company fetch error:",
              error
            );
          }
        })
      );

      setCompanies(uniqueCompanies);
    } catch (error) {
      console.error(
        "Internship fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    document
      .getElementById("internships")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const filteredInternships =
    internships.filter((item) =>
      item.jobTitle
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  if (loading) {
    return (
      <div className="internship-page">
        <NavBar />

        <div className="loading-container">
          <h2>
            Loading internships...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />

      <div className="internship-page">
        <section
          className="intern-hero"
          id="home"
        >
          <div className="intern-hero-overlay"></div>

          <div className="intern-hero-content">
            <span className="hero-badge">
              Find Internships. Build
              Skills.
            </span>

            <h1>
              Explore Career-Building
              Internships
            </h1>

            <p>
              Upgrade your skills with
              industry-focused internships
              designed for students,
              freshers and job seekers.
            </p>

            <div className="intern-search-box">
              <input
                type="text"
                placeholder="Search internships like React, UI UX, Python..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="intern-stats-card">
          <div className="intern-stat-item">
            <h3>
              {internships.length}+
            </h3>

            <p>Career Internships</p>
          </div>

          <div className="intern-stat-item">
            <h3>
              {companies.length}+
            </h3>

            <p>Hiring Companies</p>
          </div>

          <div className="intern-stat-item">
            <h3>1000+</h3>

            <p>Applications</p>
          </div>

          <div className="intern-stat-item">
            <h3>4.8</h3>

            <p>Average Rating</p>
          </div>
        </section>

        <section
          id="internships"
          className="internships-list-section"
        >
          <Internshipjobs
            internships={
              filteredInternships
            }
            searchTerm={searchTerm}
          />
        </section>

        <section
          className="trusted-section"
          id="companies"
        >
          <p className="section-subtitle">
            Top Companies
          </p>

          <h2>
            Trusted Hiring Partners
          </h2>

          <div className="company-grid">
            {companies.length > 0 ? (
              companies.map((c) => (
                <div
                  className="company-card"
                  key={c.id}
                >
                  <img
                    src={c.logo}
                    alt={c.name}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/100")
                    }
                  />

                  <p>{c.name}</p>
                </div>
              ))
            ) : (
              <p className="no-data">
                No companies available
              </p>
            )}
          </div>
        </section>

        <section className="testimonial-section">
          <div className="testimonial-box">
            <p className="section-subtitle">
              Testimonials
            </p>

            <h2>
              What Candidates Say
            </h2>

            <p className="testimonial-text">
              “This platform helped me
              land my first internship.
              The process was smooth and
              I gained real experience!”
            </p>

            <h4>
              – Rahul, Student
            </h4>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}