import React, { useMemo, useState , useEffect } from "react";
import "./EmployerDashboard.css";

import EmployeeSidebar from "./EmployeeSidebar/EmployeeSidebar";
import CompanyProfile from "./CompanyProfile/CompanyProfile";
import ManageJobs from "./ManageJobs/ManageJobs";
import Applicants from "./Applicants/Applicants";
import NavBar from "../../HomePage/NavBar/NavBar";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = () => {

const navigate = useNavigate();
const location = useLocation();

const [activeMenu, setActiveMenu] = useState(
    location.state?.tab || "profile"
);

const [searchTerm, setSearchTerm] = useState("");

const [companyProfile, setCompanyProfile] = useState({});

const [jobs, setJobs] = useState([]);
const [applicants, setApplicants] = useState([]);
const userId = Number(localStorage.getItem("userId"));

const fetchApplicants = async () => {
    try {
        const company = localStorage.getItem("companyName");

        console.log("Company:", company); 

        const res = await axios.get(
            `http://localhost:8080/application/applicants/company/${company}`
        );

        console.log("API RESPONSE:", res.data); 

        setApplicants(res.data || []);

    } catch (error) {
        console.error("Applicants Fetch Error:", error);
    }
};


useEffect(() => {
    const fetchData = async () => {
        try {
            const companyRes = await axios.get(
                `http://localhost:8080/api/company-profile/user/${userId}`
            );
            setCompanyProfile(companyRes.data || {});
            localStorage.setItem("companyName", companyRes.data.companyName);
            const jobsRes = await axios.get(
                `http://localhost:8080/api/aftergrad/user/${userId}`
            );
            setJobs(jobsRes.data);

            await fetchApplicants();

        } catch (error) {
            console.error("API ERROR:", error);
        }
    };

    fetchData();
}, [userId]);


const handleSidebarChange = (menu) => {

    if (menu === "postJob") {
        navigate("/postjob");  
        return;
    }

    setActiveMenu(menu);
    setSearchTerm("");
};

const handleCompanyProfileChange = (e) => {
    setCompanyProfile({
        ...companyProfile,
        [e.target.name]: e.target.value,
    });
};

const handleSaveCompanyProfile = async (e) => {
    e.preventDefault();

    try {
        await axios.put(
            `http://localhost:8080/api/company-profile/${companyProfile.id}`,
            companyProfile,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        alert("Company profile updated successfully!");

    } catch (error) {
        console.error(error);
    }
};

const handleEditJob = (job) => {
    navigate("/postjob", { state: { job } });
};


const handleDeleteJob = async (id) => {
    try {
        await axios.delete(
            `http://localhost:8080/api/aftergrad/delete/${id}/${userId}`
        );

        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (error) {
        console.error(error);
    }
};

const handleToggleJobStatus = async (id) => {
    try {
        await axios.put(`http://localhost:8080/api/jobs/toggle/${id}`);

        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job.id === id
                    ? { ...job, status: job.status === "Open" ? "Closed" : "Open" }
                    : job
            )
        );
    } catch (error) {
        console.error(error);
    }
};


const filteredJobs = useMemo(() => {
    return jobs.filter(
        (job) =>
            job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
}, [jobs, searchTerm]);

const filteredApplicants = useMemo(() => {
    return applicants.filter(
        (applicant) =>
            applicant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
}, [applicants, searchTerm]);


const [userName, setUserName] = useState("User");

useEffect(() => {
    const storedName =
        localStorage.getItem("name") ||
        localStorage.getItem("username") ||
        "User";

    setUserName(storedName);
}, []);


const analytics = {
    totalJobs: jobs.length,
    openJobs: jobs.filter((job) => job.status === "Open").length,
    totalApplicants: applicants.length,
    shortlisted: applicants.filter((a) => a.status === "SHORTLISTED").length,
    rejected: applicants.filter((a) => a.status === "REJECTED").length,
    pending: applicants.filter((a) => a.status === "APPLIED").length,
};


const summaryCards = [
    {
        title: "Total Jobs",
        value: analytics.totalJobs,
        subText: `${analytics.openJobs} open positions`,
        className: "blueCard",
    },
    {
        title: "Applicants",
        value: analytics.totalApplicants,
        subText: `${analytics.pending} pending reviews`,
        className: "purpleCard",
    },
    {
        title: "Shortlisted",
        value: analytics.shortlisted,
        subText: "Candidates selected",
        className: "greenCard",
    },
    {
        title: "Rejected",
        value: analytics.rejected,
        subText: "Candidates not selected",
        className: "redCard",
    },
];


return (
    <>
    <NavBar />

    <div className="employeeDashboardLayout">
        <EmployeeSidebar
            activeMenu={activeMenu}
            onMenuChange={handleSidebarChange}
        />

        <main className="employeeDashboardMainContent">

            <div className="employeeDashboardTopbar">
                <div>
                    <h1>Welcome, {userName}</h1>
                    <p>Manage company profile, jobs, and applicants</p>
                </div>
            </div>

            <div className="employeeDashboardCardsGrid">
                {summaryCards.map((card, index) => (
                    <div className={`employeeDashboardSummaryCard ${card.className}`} key={index}>
                        <h3>{card.title}</h3>
                        <h2>{card.value}</h2>
                        <p>{card.subText}</p>
                    </div>
                ))}
            </div>

            <div className="employeeDashboardSections">

                {activeMenu === "profile" && (
                    <CompanyProfile
                        companyProfile={companyProfile}
                        onChange={handleCompanyProfileChange}
                        onSave={handleSaveCompanyProfile}
                    />
                )}

                {activeMenu === "manageJobs" && (
                    <ManageJobs
                        filteredJobs={filteredJobs}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                        onToggleStatus={handleToggleJobStatus}
                    />
                )}

                {activeMenu === "applicants" && (
<Applicants 
    applicants={filteredApplicants || []}
    fetchApplicants={fetchApplicants}
/>

                )}

            </div>
        </main>
    </div>
    </>
);
};

export default EmployeeDashboard;