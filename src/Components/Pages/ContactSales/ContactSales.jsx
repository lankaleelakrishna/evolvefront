import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import "./ContactSales.css";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";

const plans = [
    {
        id: "starter",
        name: "Starter Hiring",
        price: "₹2,999",
        duration: "/month",
        description: "Perfect for startups and small companies.",
        features: ["5 Job Posts", "100 Candidate Views", "Email Support"],
    },
    {
        id: "growth",
        name: "Growth Hiring",
        price: "₹7,999",
        duration: "/month",
        description: "Best for growing teams hiring every month.",
        popular: true,
        features: ["25 Job Posts", "1000 Candidate Views", "Featured Listings", "Priority Support"],
    },
    {
        id: "enterprise",
        name: "Enterprise Hiring",
        price: "₹19,999",
        duration: "/month",
        description: "For bulk hiring and campus recruitment.",
        features: ["Unlimited Job Posts", "Unlimited Candidate Views", "Dedicated Manager"],
    },
];

const faqs = [
    {
        q: "Who can contact sales?",
        a: "Employers, recruiters, HR teams, startups, and enterprises can contact sales.",
    },
    {
        q: "Can I post internship jobs?",
        a: "Yes. You can post internships, fresher jobs, full-time jobs, and bulk hiring jobs.",
    },
    {
        q: "Can I select a pricing plan?",
        a: "Yes. Click any pricing card. The selected plan will be submitted with your request.",
    },
];

const ContactSales = () => {
    const [selectedPlan, setSelectedPlan] = useState("growth");
    const [openFaq, setOpenFaq] = useState(0);
    const [submittedData, setSubmittedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        workEmail: "",
        phoneNumber: "",
        companySize: "",
        hiringNeed: "",
        preferredCallbackDate: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

    const getSelectedPlan = () => plans.find((plan) => plan.id === selectedPlan);

    const validateForm = () => {
        const newErrors = {};

        const nameRegex = /^[A-Za-z\s]+$/;
        const companyRegex = /^[A-Za-z\s.&-]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (!nameRegex.test(formData.fullName.trim())) {
            newErrors.fullName = "Full name should contain only letters";
        }

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        } else if (!companyRegex.test(formData.companyName.trim())) {
            newErrors.companyName = "Company name should not contain numbers";
        }

        if (!formData.workEmail.trim()) {
            newErrors.workEmail = "Work email is required";
        } else if (!emailRegex.test(formData.workEmail.trim())) {
            newErrors.workEmail = "Enter a valid email address";
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Enter valid 10 digit Indian mobile number";
        }

        if (!formData.companySize) {
            newErrors.companySize = "Select company size";
        }

        if (!formData.hiringNeed) {
            newErrors.hiringNeed = "Select hiring need";
        }

        if (!formData.preferredCallbackDate) {
            newErrors.preferredCallbackDate = "Select callback date";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;

        if (name === "fullName") {
            updatedValue = value.replace(/[^A-Za-z\s]/g, "");
        }

        if (name === "companyName") {
            updatedValue = value.replace(/[0-9]/g, "");
        }

        if (name === "phoneNumber") {
            updatedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
        }

        setFormData({
            ...formData,
            [name]: updatedValue,
        });

        setErrors({
            ...errors,
            [name]: "",
        });

        setSubmittedData(null);
        setApiError(null);
    };

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
        setSubmittedData(null);
        setApiError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const plan = getSelectedPlan();

        const finalData = {
            ...formData,
            selectedPlan: plan.name,
            planAmount: plan.price,
            duration: plan.duration,
        };

        setLoading(true);
        setApiError(null);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/hiring-plan/add`,
                finalData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("API Response:", response.data);

            setSubmittedData(finalData);

            setFormData({
                fullName: "",
                companyName: "",
                workEmail: "",
                phoneNumber: "",
                companySize: "",
                hiringNeed: "",
                preferredCallbackDate: "",
                message: "",
            });

            setErrors({});
        } catch (error) {
            console.error("API Error:", error);

            if (error.response) {
                setApiError(
                    error.response.data?.message ||
                    `Server error: ${error.response.status}`
                );
            } else if (error.request) {
                setApiError("No response from server. Please check your connection.");
            } else {
                setApiError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            fullName: "",
            companyName: "",
            workEmail: "",
            phoneNumber: "",
            companySize: "",
            hiringNeed: "",
            preferredCallbackDate: "",
            message: "",
        });

        setSelectedPlan("growth");
        setErrors({});
        setSubmittedData(null);
        setApiError(null);
        setLoading(false);
    };

    return (
        <>
            <NavBar />

            <div className="contactSalesPage">
                <section className="contactSalesHero">
                    <div className="contactSalesHeroContent">
                        <span className="salesLabel">For Employers & Recruiters</span>

                        <h1>
                            Hire Better Talent with <span>Evolve</span>
                        </h1>

                        <p>
                            Post jobs, promote openings, manage applications, and hire freshers,
                            interns, and skilled candidates faster.
                        </p>

                        <div className="heroStats">
                            <div className="heroStatCard">
                                <h3>10K+</h3>
                                <p>Active Candidates</p>
                            </div>

                            <div className="heroStatCard">
                                <h3>500+</h3>
                                <p>Hiring Companies</p>
                            </div>

                            <div className="heroStatCard">
                                <h3>95%</h3>
                                <p>Faster Shortlisting</p>
                            </div>
                        </div>
                    </div>

                    <div className="contactSalesFormCard">
                        <div className="formHeader">
                            <span>Contact Sales</span>

                            <h2>Let's build your hiring plan</h2>

                            <p>
                                Selected Plan: <b>{getSelectedPlan().name}</b> -{" "}
                                {getSelectedPlan().price}
                                {getSelectedPlan().duration}
                            </p>
                        </div>

                        {submittedData && (
                            <div className="successMessage">
                                Request submitted successfully! Our sales team will contact you soon.
                            </div>
                        )}

                        {apiError && (
                            <div className="errorMessage">
                                {apiError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="formGrid">
                                <div className="formGroup">
                                    <label>Full Name *</label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />

                                    {errors.fullName && <small>{errors.fullName}</small>}
                                </div>

                                <div className="formGroup">
                                    <label>Company Name *</label>

                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Enter company name"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />

                                    {errors.companyName && <small>{errors.companyName}</small>}
                                </div>

                                <div className="formGroup">
                                    <label>Work Email *</label>

                                    <input
                                        type="email"
                                        name="workEmail"
                                        placeholder="hr@company.com"
                                        value={formData.workEmail}
                                        onChange={handleChange}
                                    />

                                    {errors.workEmail && <small>{errors.workEmail}</small>}
                                </div>

                                <div className="formGroup">
                                    <label>Phone Number *</label>

                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        name="phoneNumber"
                                        placeholder="9876543210"
                                        maxLength="10"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />

                                    {errors.phoneNumber && <small>{errors.phoneNumber}</small>}
                                </div>

                                <div className="formGroup">
                                    <label>Company Size *</label>

                                    <select
                                        name="companySize"
                                        value={formData.companySize}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select company size</option>
                                        <option value="1-10">1 - 10 Employees</option>
                                        <option value="11-50">11 - 50 Employees</option>
                                        <option value="51-200">51 - 200 Employees</option>
                                        <option value="201-500">201 - 500 Employees</option>
                                        <option value="500+">500+ Employees</option>
                                    </select>

                                    {errors.companySize && <small>{errors.companySize}</small>}
                                </div>

                                <div className="formGroup">
                                    <label>Hiring Need *</label>

                                    <select
                                        name="hiringNeed"
                                        value={formData.hiringNeed}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select hiring need</option>
                                        <option value="Freshers">Freshers</option>
                                        <option value="Interns">Interns</option>
                                        <option value="Experienced">Experienced Candidates</option>
                                        <option value="Bulk Hiring">Bulk Hiring</option>
                                        <option value="Campus Hiring">Campus Hiring</option>
                                    </select>

                                    {errors.hiringNeed && <small>{errors.hiringNeed}</small>}
                                </div>

                                <div className="formGroup fullWidth">
                                    <label>Preferred Callback Date *</label>

                                    <input
                                        type="date"
                                        name="preferredCallbackDate"
                                        value={formData.preferredCallbackDate}
                                        onChange={handleChange}
                                    />

                                    {errors.preferredCallbackDate && (
                                        <small>{errors.preferredCallbackDate}</small>
                                    )}
                                </div>
                            </div>

                            <div className="formGroup">
                                <label>Message</label>

                                <textarea
                                    name="message"
                                    placeholder="Tell us about your hiring goals..."
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="formActions">
                                <button
                                    type="submit"
                                    className="salesSubmitBtn"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Request Callback"}
                                </button>

                                <button
                                    type="button"
                                    className="resetBtn"
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="pricingSection">
                    <div className="sectionTitle">
                        <span>Hiring Plans</span>
                        <h2>Choose a plan that fits your hiring goals</h2>
                    </div>

                    <div className="pricingGrid">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`pricingCard ${plan.popular ? "popularPlan" : ""} ${
                                    selectedPlan === plan.id ? "selectedPlan" : ""
                                }`}
                                onClick={() => handlePlanSelect(plan.id)}
                            >
                                {plan.popular && (
                                    <div className="popularBadge">Most Popular</div>
                                )}

                                <h3>{plan.name}</h3>

                                <p className="planDescription">{plan.description}</p>

                                <div className="planPrice">
                                    <h2>{plan.price}</h2>
                                    <span>{plan.duration}</span>
                                </div>

                                <ul>
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlanSelect(plan.id);
                                    }}
                                >
                                    {selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {submittedData && (
                    <section className="submittedPreview">
                        <h2>Submitted Request Preview</h2>

                        <div className="previewGrid">
                            <p><b>Name:</b> {submittedData.fullName}</p>
                            <p><b>Company:</b> {submittedData.companyName}</p>
                            <p><b>Email:</b> {submittedData.workEmail}</p>
                            <p><b>Phone:</b> {submittedData.phoneNumber}</p>
                            <p><b>Hiring Need:</b> {submittedData.hiringNeed}</p>
                            <p><b>Plan:</b> {submittedData.selectedPlan}</p>
                            <p><b>Amount:</b> {submittedData.planAmount}{submittedData.duration}</p>
                            <p><b>Callback Date:</b> {submittedData.preferredCallbackDate}</p>
                        </div>
                    </section>
                )}

                <section className="faqSection">
                    <div className="sectionTitle">
                        <span>FAQ</span>

                        <h2>Frequently asked questions</h2>
                    </div>

                    <div className="faqList">
                        {faqs.map((item, index) => (
                            <div className="faqItem" key={index}>
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <h4>{item.q}</h4>
                                    <span>{openFaq === index ? "−" : "+"}</span>
                                </button>

                                {openFaq === index && <p>{item.a}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default ContactSales;