import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobApplication.css";

export default function JobApplication() {
    const navigate = useNavigate();

    const selectedJob = JSON.parse(localStorage.getItem("selectedJob"));
    const userId = localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        coverLetter: "",
        position: "Full-Time",
        resume: null,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleBack = () => {
        navigate(-1);
    };

    const validateForm = () => {
        const errors = {};

        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
        } else if (!nameRegex.test(formData.firstName.trim())) {
            errors.firstName = "First name should contain only letters";
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
        } else if (!nameRegex.test(formData.lastName.trim())) {
            errors.lastName = "Last name should contain only letters";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(formData.email.trim())) {
            errors.email = "Enter a valid email address";
        }

        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = "Enter valid 10 digit Indian mobile number";
        }

        if (!formData.resume) {
            errors.resume = "Please upload your resume";
        }

        if (!userId || userId === "undefined") {
            errors.userId = "User not found. Please login again.";
        }

        if (!selectedJob?.id) {
            errors.jobId = "Job not found. Please select job again.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "resume") {
            const file = files[0];

            if (file && file.size > 10 * 1024 * 1024) {
                setError("File size should be less than 10MB");
                return;
            }

            if (file && file.type !== "application/pdf") {
                setError("Only PDF resume is allowed");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                resume: file,
            }));
        } else {
            let updatedValue = value;

            if (name === "firstName" || name === "lastName") {
                updatedValue = value.replace(/[^A-Za-z\s]/g, "");
            }

            if (name === "phone") {
                updatedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
            }

            setFormData((prev) => ({
                ...prev,
                [name]: updatedValue,
            }));
        }

        setFieldErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            const formDataToSend = new FormData();

            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("coverLetter", formData.coverLetter);
            formDataToSend.append("position", formData.position);

            if (formData.resume) {
                formDataToSend.append("file", formData.resume);
            }

            formDataToSend.append("userId", Number(userId));
            formDataToSend.append("jobId", selectedJob?.id);

            console.log("Sending:", {
                userId: Number(userId),
                jobId: selectedJob?.id,
            });

            const response = await fetch("http://localhost:8080/application/apply", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                },
                body: formDataToSend,
            });

            let data;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data?.message || data || "Application failed");
            }

            setMessage("Application submitted successfully!");

            const appliedJobs =
                JSON.parse(localStorage.getItem("appliedJobs")) || [];

            if (!appliedJobs.includes(selectedJob?.id)) {
                appliedJobs.push(selectedJob?.id);
                localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
            }

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                coverLetter: "",
                position: "Full-Time",
                resume: null,
            });

            setFieldErrors({});

            setTimeout(() => {
                navigate("/candidate-dashboard");
            }, 1500);
        } catch (err) {
            console.error("ERROR:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="application-page">
            <button type="button" className="back-button" onClick={handleBack}>
                ← Back
            </button>

            <h1>Submit your candidate application</h1>

            <p className="subtitle">
                Complete the form below to apply for the job.
            </p>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <label>Applicant Name *</label>

                    <div className="name-row">
                        <div>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <small>First</small>
                            {fieldErrors.firstName && (
                                <p className="error">{fieldErrors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <small>Last</small>
                            {fieldErrors.lastName && (
                                <p className="error">{fieldErrors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {fieldErrors.email && (
                        <p className="error">{fieldErrors.email}</p>
                    )}

                    <label>Phone Number *</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="10"
                    />
                    {fieldErrors.phone && (
                        <p className="error">{fieldErrors.phone}</p>
                    )}

                    <label>Cover Letter</label>
                    <textarea
                        rows="4"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                    ></textarea>

                    <label>Upload Resume *</label>
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf"
                        onChange={handleChange}
                    />
                    {fieldErrors.resume && (
                        <p className="error">{fieldErrors.resume}</p>
                    )}

                    <label>Position Applying For</label>
                    <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    >
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Internship</option>
                    </select>

                    {fieldErrors.userId && <p className="error">{fieldErrors.userId}</p>}
                    {fieldErrors.jobId && <p className="error">{fieldErrors.jobId}</p>}

                    {error && <p className="error">{error}</p>}
                    {message && <p className="success">{message}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}