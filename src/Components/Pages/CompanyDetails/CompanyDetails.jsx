import React, { useEffect, useState } from "react";
import "./CompanyDetails.css";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";
import { useParams, useNavigate } from "react-router-dom";

const CompanyDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("about");

    const [company, setCompany] = useState(null);

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchCompany();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchCompany = async () => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/company-profile/${id}`
            );

            const companyData = await response.json();

            console.log("COMPANY:", companyData);

            setCompany(companyData);

            const jobsResponse = await fetch(
                `http://localhost:8080/api/aftergrad/company/${companyData.userId}`
            );

            const jobsData = await jobsResponse.json();

            console.log("JOBS:", jobsData);

            setJobs(jobsData);

        } catch (error) {

            console.error("Company details error:", error);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (
            <>
                <NavBar />

                <div className="companyDetailsPage">
                    <h2>Loading...</h2>
                </div>

                <Footer />
            </>
        );
    }

    if (!company) {

        return (
            <>
                <NavBar />

                <div className="companyDetailsPage">

                    <div className="companyDetailsNotFound">

                        <h2>Company Details Not Found</h2>

                        <p>
                            The company you are looking for does not exist.
                        </p>

                        <button
                            onClick={() => navigate("/CompanyPage")}
                        >
                            Back to Companies
                        </button>

                    </div>

                </div>

                <Footer />
            </>
        );
    }

    const logoUrl =
        `http://localhost:8080/api/company-profile/${company.id}/logo`;

    return (
        <>
            <NavBar />

            <div className="companyDetailsPage">

                <div className="companyDetailsBanner">

                    <h1>Company Details</h1>

                    <p>
                        Explore company profile, openings and culture
                    </p>

                </div>

                <div className="companyDetailsContainer">

                    <div className="companyDetailsHeader">

                        <div className="companyDetailsHeaderLeft">

                            <img
                                src={logoUrl}
                                alt={company.companyName}
                                className="companyDetailsLogo"
                                onError={(e) =>
                                    e.target.src =
                                    "https://via.placeholder.com/120"
                                }
                            />

                            <div className="companyDetailsInfo">

                                <h2>{company.companyName}</h2>

                                <p>
                                    📍 {company.location || "Location not available"}
                                </p>

                                <p>
                                    💼 {company.industry || "IT & Software"}
                                </p>

                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="companyDetailsWebsite"
                                >
                                    {company.website}
                                </a>

                            </div>

                        </div>

                        <div className="companyDetailsStats">

                            <div className="companyDetailsStatCard">

                                <h3>{jobs.length}</h3>

                                <span>Open Jobs</span>

                            </div>

                            {/* <div className="companyDetailsStatCard">

                                <h3>
                                    {company.foundedYear || "2024"}
                                </h3>

                                <span>Founded</span>

                            </div> */}

                        </div>

                    </div>

                    <div className="companyDetailsTabs">

                        <button
                            className={activeTab === "about" ? "active" : ""}
                            onClick={() => setActiveTab("about")}
                        >
                            About
                        </button>

                        <button
                            className={activeTab === "jobs" ? "active" : ""}
                            onClick={() => setActiveTab("jobs")}
                        >
                            Job Openings
                        </button>

                    </div>


                    <div className="companyDetailsTabContent">
                        {activeTab === "about" && (

                            <div className="companyDetailsMainCard">

                                <h3>
                                    About {company.companyName}
                                </h3>

                                <p className="companyDetailsAboutText">

                                    {
                                        company.description ||
                                        "Company profile available on Aftergraduate platform."
                                    }

                                </p>

                            </div>
                        )}

                        {activeTab === "jobs" && (

                            <div className="companyDetailsJobsList">

                                {jobs.length === 0 ? (

                                    <p className="companyDetailsEmptyText">
                                        No jobs available
                                    </p>

                                ) : (

                                    jobs.map((job) => (

                                        <div
                                            key={job.id}
                                            className="companyDetailsJobCard"
                                        >

                                            <div>

                                                <h4>{job.jobTitle}</h4>

                                                <p>
                                                    📍 {job.location}
                                                </p>

                                                <p>
                                                    ₹{job.salary}
                                                </p>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(`/job-details/${job.id}`)
                                                }
                                            >
                                                Apply Now
                                            </button>

                                        </div>
                                    ))
                                )}

                            </div>
                        )}

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
};

export default CompanyDetails;