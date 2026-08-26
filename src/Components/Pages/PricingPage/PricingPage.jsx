import React, { useState } from "react";
import "./PricingPage.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";

const plans = [
    {
        id: "starter",
        name: "Starter",
        monthly: 2999,
        yearly: 29990,
        description: "Best for small teams and startups.",
        features: [
            "5 Job Posts",
            "100 Candidate Views",
            "Basic Applicant Tracking",
            "Company Profile Listing",
            "Email Support",
        ],
    },
    {
        id: "growth",
        name: "Growth",
        monthly: 7999,
        yearly: 79990,
        popular: true,
        description: "Best for growing companies hiring monthly.",
        features: [
            "25 Job Posts",
            "1000 Candidate Views",
            "Featured Job Listings",
            "Advanced Candidate Filters",
            "Priority Support",
            "Resume Shortlisting Tools",
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        monthly: 19999,
        yearly: 199990,
        description: "Best for bulk hiring and campus drives.",
        features: [
            "Unlimited Job Posts",
            "Unlimited Candidate Views",
            "Dedicated Account Manager",
            "Campus Hiring Campaigns",
            "Custom Hiring Dashboard",
            "Premium Employer Branding",
        ],
    },
];

const PricingPage = () => {
    const [billing, setBilling] = useState("monthly");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});

    const formatPrice = (amount) => {
        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const openModal = (plan) => {
        setSelectedPlan(plan);
        setShowModal(true);
        setSuccessMsg("");
        setErrors({});
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPlan(null);
        setErrors({});
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.company.trim()) newErrors.company = "Company name is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter valid email";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Enter valid 10 digit mobile number";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const requestData = {
            ...formData,
            plan: selectedPlan.name,
            billing,
            amount:
                billing === "monthly"
                    ? selectedPlan.monthly
                    : selectedPlan.yearly,
        };

        console.log("Pricing Request:", requestData);

        setSuccessMsg("Plan request submitted successfully!");

        setFormData({
            name: "",
            company: "",
            email: "",
            phone: "",
        });
    };

    return (
        <>
        <NavBar></NavBar>
        <div className="pricingPage">
            <section className="pricingHero">
                <span className="pricingBadge">Employer Pricing</span>
                <h1>Simple Plans for Powerful Hiring</h1>
                <p>
                    Choose the right hiring plan for your company. Post jobs, promote
                    openings, manage applicants, and hire freshers faster with
                    EVOLVE.
                </p>

                <div className="billingToggle">
                    <button
                        className={billing === "monthly" ? "active" : ""}
                        onClick={() => setBilling("monthly")}
                    >
                        Monthly
                    </button>

                    <button
                        className={billing === "yearly" ? "active" : ""}
                        onClick={() => setBilling("yearly")}
                    >
                        Yearly <span>Save 2 Months</span>
                    </button>
                </div>
            </section>

            <section className="pricingCardsSection">
                <div className="pricingGrid">
                    {plans.map((plan) => {
                        const price =
                            billing === "monthly" ? plan.monthly : plan.yearly;

                        return (
                            <div
                                className={`pricingCard ${plan.popular ? "popular" : ""}`}
                                key={plan.id}
                            >
                                {plan.popular && <div className="popularTag">Most Popular</div>}

                                <h3>{plan.name}</h3>
                                <p className="planDesc">{plan.description}</p>

                                <div className="priceBox">
                                    <h2>{formatPrice(price)}</h2>
                                    <span>/{billing === "monthly" ? "month" : "year"}</span>
                                </div>

                                <ul>
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>

                                <button className="chooseBtn" onClick={() => openModal(plan)}>
                                    Choose {plan.name}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="pricingFeatures">
                <h2>Everything You Need to Hire Better</h2>

                <div className="featureGrid">
                    <div className="featureCard">
                        <h3>🎯 Targeted Reach</h3>
                        <p>Reach freshers, interns, and skilled candidates faster.</p>
                    </div>

                    <div className="featureCard">
                        <h3>📢 Featured Jobs</h3>
                        <p>Promote jobs with higher visibility and better engagement.</p>
                    </div>

                    <div className="featureCard">
                        <h3>⚡ Fast Shortlisting</h3>
                        <p>Filter applicants and save quality candidate profiles.</p>
                    </div>

                    <div className="featureCard">
                        <h3>🏢 Employer Branding</h3>
                        <p>Showcase your company profile and hiring opportunities.</p>
                    </div>
                </div>
            </section>

            {showModal && selectedPlan && (
                <div className="modalOverlay">
                    <div className="pricingModal">
                        <button className="modalClose" onClick={closeModal}>
                            ×
                        </button>

                        <div className="modalHeader">
                            <span>Selected Plan</span>
                            <h2>{selectedPlan.name} Plan</h2>
                            <p>
                                Amount:{" "}
                                <b>
                                    {formatPrice(
                                        billing === "monthly"
                                            ? selectedPlan.monthly
                                            : selectedPlan.yearly
                                    )}
                                    /{billing === "monthly" ? "month" : "year"}
                                </b>
                            </p>
                        </div>

                        {successMsg && <div className="successBox">{successMsg}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="formGroup">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <small>{errors.name}</small>}
                            </div>

                            <div className="formGroup">
                                <label>Company Name *</label>
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="Enter company name"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                                {errors.company && <small>{errors.company}</small>}
                            </div>

                            <div className="formGroup">
                                <label>Work Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="hr@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <small>{errors.email}</small>}
                            </div>

                            <div className="formGroup">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="9876543210"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <small>{errors.phone}</small>}
                            </div>

                            <button type="submit" className="modalSubmitBtn">
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
        <Footer></Footer>
        </>
    );
};

export default PricingPage;