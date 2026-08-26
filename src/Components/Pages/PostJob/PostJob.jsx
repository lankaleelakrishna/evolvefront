import React, { useState, useEffect } from "react";
import "./PostJob.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import EmployeeSidebar from "../EmployerDashboard/EmployeeSidebar/EmployeeSidebar";

export default function PostJob() {

    const navigate = useNavigate();
    const location = useLocation();

    const editJob = location.state?.job;

    const userId = Number(localStorage.getItem("userId"));

    const [jobData, setJobData] = useState({
        jobTitle: "",
        compName: "",
        location: "",
        jobType: "",
        salary: "",
        expReq: "",
        jobDescription: "",
        reqSkills: "",
        applideadline: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editJob) {
            setJobData({
                jobTitle: editJob.jobTitle || "",
                compName: editJob.compName || "",
                location: editJob.location || "",
                jobType: editJob.jobType || "",
                salary: editJob.salary || "",
                expReq: editJob.expReq || "",
                jobDescription: editJob.jobDescription || "",
                reqSkills: editJob.reqSkills || "",
                applideadline: editJob.applideadline || ""
            });
        }
    }, [editJob]);

    const validateForm = () => {
        const newErrors = {};
        const today = new Date().toISOString().split("T")[0];

        if (!jobData.jobTitle.trim()) {
            newErrors.jobTitle = "Job title is required";
        } else if (jobData.jobTitle.trim().length < 3) {
            newErrors.jobTitle = "Job title must be at least 3 characters";
        } else if (jobData.jobTitle.trim().length > 50) {
            newErrors.jobTitle = "Job title must not exceed 50 characters";
        } else if (!/^[A-Za-z\s.-]+$/.test(jobData.jobTitle)) {
            newErrors.jobTitle = "Job title should contain only letters";
        }

        if (!jobData.compName.trim()) {
            newErrors.compName = "Company name is required";
        } else if (jobData.compName.trim().length < 2) {
            newErrors.compName = "Company name must be at least 2 characters";
        } else if (jobData.compName.trim().length > 50) {
            newErrors.compName = "Company name must not exceed 50 characters";
        } else if (!/^[A-Za-z\s&.-]+$/.test(jobData.compName)) {
            newErrors.compName = "Company name should contain only letters";
        }

        if (!jobData.location.trim()) {
            newErrors.location = "Location is required";
        } else if (jobData.location.trim().length < 2) {
            newErrors.location = "Location must be at least 2 characters";
        } else if (jobData.location.trim().length > 50) {
            newErrors.location = "Location must not exceed 50 characters";
        } else if (!/^[A-Za-z\s,.-]+$/.test(jobData.location)) {
            newErrors.location = "Location should contain only letters";
        }

        if (!jobData.jobType) {
            newErrors.jobType = "Please select job type";
        }

        if (!jobData.salary) {
            newErrors.salary = "Salary is required";
        } else if (Number(jobData.salary) <= 0) {
            newErrors.salary = "Salary must be greater than 0";
        } else if (Number(jobData.salary) > 99999999) {
            newErrors.salary = "Salary must not exceed 99999999";
        }

        if (!jobData.expReq && jobData.expReq !== 0) {
            newErrors.expReq = "Experience is required";
        } else if (Number(jobData.expReq) < 0) {
            newErrors.expReq = "Experience cannot be negative";
        } else if (Number(jobData.expReq) > 50) {
            newErrors.expReq = "Experience must not exceed 50 years";
        }

        if (!jobData.applideadline) {
            newErrors.applideadline = "Application deadline is required";
        } else if (jobData.applideadline < today) {
            newErrors.applideadline = "Deadline cannot be a past date";
        }

        if (!jobData.reqSkills.trim()) {
            newErrors.reqSkills = "Required skills are required";
        } else if (jobData.reqSkills.trim().length < 2) {
            newErrors.reqSkills = "Required skills must be at least 2 characters";
        } else if (jobData.reqSkills.trim().length > 200) {
            newErrors.reqSkills = "Required skills must not exceed 200 characters";
        }

        if (!jobData.jobDescription.trim()) {
            newErrors.jobDescription = "Job description is required";
        } else if (jobData.jobDescription.trim().length < 20) {
            newErrors.jobDescription = "Job description must be at least 20 characters";
        } else if (jobData.jobDescription.trim().length > 2000) {
            newErrors.jobDescription = "Job description must not exceed 2000 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "jobTitle") {
            const onlyLetters = value.replace(/[^A-Za-z\s.-]/g, "");
            setJobData((prev) => ({
                ...prev,
                [name]: onlyLetters.slice(0, 50)
            }));
        } else if (name === "compName") {
            const onlyCompanyName = value.replace(/[^A-Za-z\s&.-]/g, "");
            setJobData((prev) => ({
                ...prev,
                [name]: onlyCompanyName.slice(0, 50)
            }));
        } else if (name === "location") {
            const onlyLocation = value.replace(/[^A-Za-z\s,.-]/g, "");
            setJobData((prev) => ({
                ...prev,
                [name]: onlyLocation.slice(0, 50)
            }));
        } else if (name === "salary") {
            const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);
            setJobData((prev) => ({
                ...prev,
                [name]: onlyNumbers
            }));
        } else if (name === "expReq") {
            const onlyNumbers = value.replace(/\D/g, "").slice(0, 2);
            setJobData((prev) => ({
                ...prev,
                [name]: onlyNumbers
            }));
        } else if (name === "reqSkills") {
            setJobData((prev) => ({
                ...prev,
                [name]: value.slice(0, 200)
            }));
        } else if (name === "jobDescription") {
            setJobData((prev) => ({
                ...prev,
                [name]: value.slice(0, 2000)
            }));
        } else {
            setJobData((prev) => ({
                ...prev,
                [name]: value
            }));
        }

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...jobData,
                userId: userId,
                salary: jobData.salary ? Number(jobData.salary) : 0,
                expReq: jobData.expReq ? Number(jobData.expReq) : 0
            };

            console.log("Sending Payload:", payload);

            if (editJob) {
                await axios.put(
                    `http://localhost:8080/api/aftergrad/update/${editJob.id}`,
                    payload,
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );

                alert("Job Updated Successfully!");
            } else {
                await axios.post(
                    "http://localhost:8080/api/aftergrad/add",
                    payload,
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );

                alert("Job Posted Successfully!");
            }

            navigate("/employee-dashboard");

        } catch (error) {
            console.error("ERROR:", error.response?.data || error.message);
            alert("Failed to process job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />

            <div className="employeeDashboardContainer">

                <EmployeeSidebar
                    activeMenu="postJob"
                    onMenuChange={(menu) => {

                        if (menu === "postJob") {
                            navigate("/postjob");
                        }

                        if (menu === "profile") {
                            navigate("/employee-dashboard", { state: { tab: "profile" } });
                        }

                        if (menu === "manageJobs") {
                            navigate("/employee-dashboard", { state: { tab: "manageJobs" } });
                        }

                        if (menu === "applicants") {
                            navigate("/employee-dashboard", { state: { tab: "applicants" } });
                        }
                    }}
                />

                <div className="employeeDashboardContent">

                    <div className="postjob-page">
                        <div className="postjob-container">
                            <h2>{editJob ? "Edit Job" : "Post a New Job"}</h2>

                            <form onSubmit={handleSubmit} className="postjob-form">

                                <div className="form-group">
                                    <label>Job Title</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={jobData.jobTitle}
                                        onChange={handleChange}
                                        required
                                        minLength={3}
                                        maxLength={50}
                                    />
                                    {errors.jobTitle && (
                                        <small className="errorText">{errors.jobTitle}</small>
                                    )}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            name="compName"
                                            value={jobData.compName}
                                            onChange={handleChange}
                                            required
                                            minLength={2}
                                            maxLength={50}
                                        />
                                        {errors.compName && (
                                            <small className="errorText">{errors.compName}</small>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={jobData.location}
                                            onChange={handleChange}
                                            required
                                            minLength={2}
                                            maxLength={50}
                                        />
                                        {errors.location && (
                                            <small className="errorText">{errors.location}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Job Type</label>
                                        <select
                                            name="jobType"
                                            value={jobData.jobType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="FULL_TIME">Full-Time</option>
                                            <option value="PART_TIME">Part-Time</option>
                                            <option value="INTERNSHIP">Internship</option>
                                            <option value="CONTRACT">Contract</option>
                                        </select>
                                        {errors.jobType && (
                                            <small className="errorText">{errors.jobType}</small>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Salary per month</label>
                                        <input
                                            type="number"
                                            name="salary"
                                            value={jobData.salary}
                                            onChange={handleChange}
                                            min={1}
                                            max={99999999}
                                            required
                                        />
                                        {errors.salary && (
                                            <small className="errorText">{errors.salary}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Experience Required</label>
                                        <input
                                            type="number"
                                            name="expReq"
                                            value={jobData.expReq}
                                            onChange={handleChange}
                                            min={0}
                                            max={50}
                                            required
                                        />
                                        {errors.expReq && (
                                            <small className="errorText">{errors.expReq}</small>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Application Deadline</label>
                                        <input
                                            type="date"
                                            name="applideadline"
                                            value={jobData.applideadline}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                        />
                                        {errors.applideadline && (
                                            <small className="errorText">{errors.applideadline}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Required Skills</label>
                                    <input
                                        type="text"
                                        name="reqSkills"
                                        value={jobData.reqSkills}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        maxLength={200}
                                    />
                                    {errors.reqSkills && (
                                        <small className="errorText">{errors.reqSkills}</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Job Description</label>
                                    <textarea
                                        name="jobDescription"
                                        rows="5"
                                        value={jobData.jobDescription}
                                        onChange={handleChange}
                                        required
                                        minLength={20}
                                        maxLength={2000}
                                    />
                                    {errors.jobDescription && (
                                        <small className="errorText">{errors.jobDescription}</small>
                                    )}
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading
                                        ? (editJob ? "Updating..." : "Posting...")
                                        : (editJob ? "Update Job" : "Post Job")}
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
}