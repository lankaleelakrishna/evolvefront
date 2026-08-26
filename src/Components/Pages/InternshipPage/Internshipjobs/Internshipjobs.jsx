import React, { useEffect, useState } from "react";
import "./Internshipjobs.css";

import { useNavigate } from "react-router-dom";

import { FaMapMarkerAlt } from "react-icons/fa";

const Internshipjobs = ({ searchTerm = "" }) => {

    const navigate = useNavigate();

    const [internshipJobs, setInternshipJobs] = useState([]);

    const [companyMap, setCompanyMap] = useState({});

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

            console.log("INTERNSHIPS:", data);

            setInternshipJobs(data);

            const map = {};

            await Promise.all(

                data.map(async (job) => {

                    try {

                        const companyResponse = await fetch(
                            `http://localhost:8080/api/company-profile/user/${job.userId}`
                        );

                        const company = await companyResponse.json();

                        console.log("COMPANY:", company);

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

    const filteredJobs = internshipJobs.filter((job) => {

        const search = searchTerm.toLowerCase();

        return (
            job.jobTitle?.toLowerCase().includes(search) ||
            job.compName?.toLowerCase().includes(search) ||
            job.location?.toLowerCase().includes(search)
        );
    });

    if (loading) {

        return (

            <div className="internships-page">

                <div className="internships-container">

                    <p className="no-data">
                        Loading internships...
                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="internships-page">

            <div className="internships-container">

                <div className="intern-header">

                    <h2>Internship Opportunities</h2>

                    <p>
                        Start your career with top companies
                    </p>

                </div>

                <div className="internship-list">

                    {filteredJobs.length > 0 ? (

                        filteredJobs.map((job) => {

                            const companyId =
                                companyMap[job.userId];

                            const logoUrl =
                                companyId
                                    ? `http://localhost:8080/api/company-profile/${companyId}/logo`
                                    : "https://via.placeholder.com/80";

                            return (

                                <div
                                    className="internship-card"
                                    key={job.id}
                                    onClick={() =>
                                        navigate(`/internjobdetails/${job.id}`)
                                    }
                                >

                                    <div className="internship-left">

                                        <img
                                            src={logoUrl}
                                            alt={job.compName}
                                            className="internship-logo"
                                            onError={(e) =>
                                                e.target.src =
                                                "https://via.placeholder.com/80"
                                            }
                                        />

                                    </div>

                                    <div className="internship-middle">

                                        <h3 className="internship-title">
                                            {job.jobTitle}
                                        </h3>

                                        <p className="internship-company">
                                            {job.compName}
                                        </p>

                                        <div className="internship-meta">

                                            <span className="internship-badge">
                                                Internship
                                            </span>

                                            <span className="internship-salary">

                                                ₹{
                                                    job.salary
                                                        ? job.salary
                                                        : "Stipend not disclosed"
                                                }

                                            </span>

                                        </div>

                                        <p className="internship-location">

                                            <FaMapMarkerAlt />

                                            {" "}

                                            {job.location}

                                        </p>

                                    </div>

                                    <div className="internship-right">

                                        <button
                                            className="apply-btn"
                                            onClick={(e) => {

                                                e.stopPropagation();

                                                navigate(
                                                    `/internjobdetails/${job.id}`
                                                );
                                            }}
                                        >
                                            Apply Now
                                        </button>

                                    </div>

                                </div>
                            );
                        })

                    ) : (

                        <p className="no-data">
                            No internships available
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Internshipjobs;