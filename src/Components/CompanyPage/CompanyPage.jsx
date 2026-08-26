import React, { useEffect, useState } from "react";
import "./CompanyPage.css";
import NavBar from "../HomePage/NavBar/NavBar";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

import {
    FaBuilding,
    FaBriefcase,
    FaStar,
    FaUsers
} from "react-icons/fa6";

const CompanyPage = () => {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/company-profile"
            );

            const data = await response.json();

            console.log("COMPANIES:", data);

            const updatedCompanies = await Promise.all(

                data.map(async (company) => {

                    try {

                        const jobsResponse = await fetch(
                            `http://localhost:8080/api/aftergrad/company/${company.userId}`
                        );

                        const jobsData = await jobsResponse.json();

                        return {
                            ...company,
                            jobs: jobsData.length || 0
                        };

                    } catch (error) {

                        console.error("Job count error:", error);

                        return {
                            ...company,
                            jobs: 0
                        };
                    }
                })
            );

            setCompanies(updatedCompanies);

        } catch (error) {

            console.error("Company fetch error:", error);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (
            <>
                <NavBar />

                <div className="companyPageLoading">
                    Loading companies...
                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar />

            <div className="companyPage">

                <section className="companyPage-hero">

                    <div className="companyPage-heroOverlay"></div>

                    <div className="companyPage-heroContent">

                        <span className="companyPage-badge">
                            Trusted Companies. Better Careers.
                        </span>

                        <h1>Explore Top Companies</h1>

                        <p>
                            Discover leading companies hiring through our platform
                            and explore available opportunities.
                        </p>

                    </div>

                </section>

                <section className="companyPage-statsCard">

                    <div className="companyPage-statItem">

                        <div className="companyPage-statIcon">
                            <FaBuilding />
                        </div>

                        <div>
                            <h3>{companies.length}+</h3>
                            <p>Top Companies</p>
                        </div>

                    </div>

                    <div className="companyPage-statItem">

                        <div className="companyPage-statIcon">
                            <FaBriefcase />
                        </div>

                        <div>
                            <h3>
                                {companies.reduce(
                                    (total, item) => total + item.jobs,
                                    0
                                )}+
                            </h3>

                            <p>Active Openings</p>
                        </div>

                    </div>

                    <div className="companyPage-statItem">

                        <div className="companyPage-statIcon">
                            <FaUsers />
                        </div>

                        <div>
                            <h3>15k+</h3>
                            <p>Candidates Hired</p>
                        </div>

                    </div>

                    <div className="companyPage-statItem">

                        <div className="companyPage-statIcon">
                            <FaStar />
                        </div>

                        <div>
                            <h3>4.8/5</h3>
                            <p>Average Rating</p>
                        </div>

                    </div>

                </section>

                <div className="companyPage-container">

                    <div className="companyPage-header">

                        <div>

                            <h2>Explore Companies</h2>

                            <p>
                                Find trusted employers and view their latest job openings.
                            </p>

                        </div>

                        <span>{companies.length} Companies</span>

                    </div>

                    <div className="companyPage-grid">

                        {companies.map((company) => {

                            const logoUrl =
                                `http://localhost:8080/api/company-profile/${company.id}/logo`;

                            return (

                                <div
                                    className="companyPage-card"
                                    key={company.id}
                                >

                                    <div className="companyPage-logoWrapper">

                                        <img
                                            src={logoUrl}
                                            alt={company.companyName}
                                            className="companyPage-logo"
                                            onError={(e) =>
                                                e.target.src =
                                                "https://via.placeholder.com/100"
                                            }
                                        />

                                    </div>

                                    <div className="companyPage-content">

                                        <h3>
                                            {company.companyName}
                                        </h3>

                                        <p className="companyPage-subtext">
                                            Trusted company profile available for viewing
                                        </p>

                                    </div>

                                    <div className="companyPage-footer">

                                        <span className="companyPage-jobs">
                                            Job Openings: {company.jobs}
                                        </span>

                                        <div className="companyPage-actions">

                                            <Link
                                                to={`/CompanyDetails/${company.id}`}
                                                className="companyPage-detailsBtn"
                                            >
                                                View Details
                                            </Link>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
};

export default CompanyPage;
