import React, { useEffect, useState } from "react";
import "./AdminCompanies.css";

const AdminCompanies = ({ filteredCompanies: propCompanies }) => {

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        setCompanies(propCompanies || []);
    }, [propCompanies]);

    return (
        <div className="adminSectionCard">

            <div className="adminSectionHeader">
                <h2>Company Profiles</h2>

                <span className="adminSectionCount">
                    Total: {companies.length}
                </span>
            </div>

            <div className="adminCompanyList">

                {companies.length > 0 ? (

                    companies.map((company) => (

                        <div
                            className="adminCompanyItem"
                            key={company.id}
                        >

                            <div className="adminCompanyInfo">

                                <h3>{company.companyName}</h3>

                                <p>
                                    {company.industry || "N/A"}
                                </p>

                                <span>
                                    Submitted: {company.submitted || "N/A"}
                                </span>

                            </div>

                        </div>
                    ))

                ) : (

                    <div className="adminNoCardData">
                        No companies found
                    </div>

                )}

            </div>
        </div>
    );
};

export default AdminCompanies;