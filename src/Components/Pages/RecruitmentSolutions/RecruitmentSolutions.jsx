import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config/api";
import "./RecruitmentSolutions.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import axios from "axios";

const allSolutions = [
    {
        id: 1,
        title: "End-to-End Hiring",
        category: "Hiring",
        desc: "Post jobs, receive applications, shortlist candidates, and hire faster.",
    },
    {
        id: 2,
        title: "Resume Database Access",
        category: "Database",
        desc: "Search verified candidate profiles based on skills, location, and experience.",
    },
    {
        id: 3,
        title: "Employer Branding",
        category: "Branding",
        desc: "Promote your company culture, benefits, and open job roles.",
    },
    {
        id: 4,
        title: "Campus Hiring",
        category: "Hiring",
        desc: "Hire freshers, interns, and graduates from colleges and universities.",
    },
];

const packages = [
    {
        name: "Starter",
        price: "₹2,999",
        jobs: "5 Job Posts",
        features: ["Basic candidate access", "Email support", "30 days validity"],
    },
    {
        name: "Professional",
        price: "₹7,999",
        jobs: "25 Job Posts",
        popular: true,
        features: ["Resume database access", "Featured jobs", "Priority support"],
    },
    {
        name: "Enterprise",
        price: "Custom",
        jobs: "Unlimited Jobs",
        features: ["Bulk hiring", "Dedicated manager", "Custom branding"],
    },
];

const faqs = [
    {
        q: "Can I post jobs?",
        a: "Yes, employers can post jobs and manage applications easily.",
    },
    {
        q: "Can I hire freshers?",
        a: "Yes, AfterGraduate supports fresher, internship, and entry-level hiring.",
    },
    {
        q: "Do you provide custom hiring support?",
        a: "Yes, enterprise customers can get dedicated recruitment support.",
    },
];

const RecruitmentSolutions = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [enquiries, setEnquiries] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        company: "",
        name: "",
        email: "",
        phone: "",
        employees: "",
        requirement: "",
    });

    const fetchEnquiries = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/recruitment/getAllEnquiries`
            );

            setEnquiries(response.data);
        } catch (error) {
            console.error("Error fetching enquiries", error);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const filteredSolutions = allSolutions.filter((item) => {
        const matchSearch =
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.desc.toLowerCase().includes(search.toLowerCase());

        const matchCategory =
            category === "All" || item.category === category;

        return matchSearch && matchCategory;
    });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company.trim()) {
            newErrors.company = "Company name is required";
        } else if (!/^[A-Za-z\s.&-]+$/.test(formData.company)) {
            newErrors.company = "Company name should not contain numbers";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            newErrors.name = "Name should contain only letters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter valid email";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Enter valid 10 digit Indian mobile number";
        }

        if (!formData.employees) {
            newErrors.employees = "Select hiring size";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;

        if (name === "company") {
            updatedValue = value.replace(/[0-9]/g, "");
        }

        if (name === "name") {
            updatedValue = value.replace(/[^A-Za-z\s]/g, "");
        }

        if (name === "phone") {
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
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);

        document
            .getElementById("recruitment-contact")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await axios.post(
                `${API_BASE_URL}/api/hiring/submit`,
                {
                    companyName: formData.company,
                    yourName: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    hiringSize: formData.employees
                }
            );

            alert("Recruitment enquiry submitted successfully!");

            fetchEnquiries();

            setFormData({
                company: "",
                name: "",
                email: "",
                phone: "",
                employees: "",
                requirement: "",
            });

            setSelectedPlan(null);
        } catch (error) {
            console.error("Error saving enquiry", error);
            alert("Failed to submit enquiry");
        }
    };

    const clearEnquiries = async () => {
        const confirmClear = window.confirm(
            "Are you sure you want to clear all enquiries?"
        );

        if (!confirmClear) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/api/recruitment/deleteAllEnquiries`
            );

            setEnquiries([]);

            alert("All enquiries cleared successfully!");
        } catch (error) {
            console.error("Error deleting enquiries", error);
            alert("Failed to clear enquiries");
        }
    };

    return (
        <>
            <NavBar />

            <div className="recruitment-page">
                <section className="recruitment-hero">
                    <div className="recruitment-hero-content">
                        <span className="recruitment-badge">
                            Recruitment Solutions
                        </span>

                        <h1>
                            Hire Better Talent Faster with EVOLVE
                        </h1>

                        <p>
                            Complete hiring solutions for companies
                            to post jobs, shortlist candidates,
                            access resumes, and manage recruitment
                            easily.
                        </p>

                        <div className="recruitment-hero-actions">
                            <a href="#recruitment-contact" className="primary-btn">
                                Contact Sales
                            </a>

                            <a href="#recruitment-packages" className="secondary-btn">
                                View Packages
                            </a>
                        </div>

                        <div className="recruitment-stats">
                            <div>
                                <h3>10K+</h3>
                                <p>Candidates</p>
                            </div>

                            <div>
                                <h3>500+</h3>
                                <p>Companies</p>
                            </div>

                            <div>
                                <h3>{enquiries.length}</h3>
                                <p>Total Enquiries</p>
                            </div>
                        </div>
                    </div>

                    <div className="recruitment-hero-card">
                        <h2>Hiring Dashboard</h2>

                        <div className="dashboard-row">
                            <span>Active Jobs</span>
                            <b>24</b>
                        </div>

                        <div className="dashboard-row">
                            <span>Applications</span>
                            <b>1,280</b>
                        </div>

                        <div className="dashboard-row">
                            <span>Shortlisted</span>
                            <b>340</b>
                        </div>

                        <div className="progress-box">
                            <p>Hiring Progress</p>

                            <div className="progress-line">
                                <span></span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="recruitment-section">
                    <div className="section-heading">
                        <span>Solutions</span>
                        <h2>Explore Recruitment Services</h2>
                        <p>
                            Search and filter services based
                            on your hiring need.
                        </p>
                    </div>

                    <div className="solution-filter-box">
                        <input
                            type="text"
                            placeholder="Search recruitment solution..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="All">
                                All Categories
                            </option>

                            <option value="Hiring">
                                Hiring
                            </option>

                            <option value="Database">
                                Database
                            </option>

                            <option value="Branding">
                                Branding
                            </option>
                        </select>
                    </div>

                    <div className="process-grid">
                        {filteredSolutions.length > 0 ? (
                            filteredSolutions.map((item) => (
                                <div className="process-card" key={item.id}>
                                    <b>
                                        {item.id < 10 ? `0${item.id}` : item.id}
                                    </b>

                                    <h3>{item.title}</h3>

                                    <p>{item.desc}</p>

                                    <button
                                        className="small-action-btn"
                                        onClick={() =>
                                            document
                                                .getElementById("recruitment-contact")
                                                ?.scrollIntoView({
                                                    behavior: "smooth",
                                                })
                                        }
                                    >
                                        Enquire Now
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">
                                No recruitment solution found.
                            </p>
                        )}
                    </div>
                </section>

                <section
                    className="packages-section"
                    id="recruitment-packages"
                >
                    <div className="section-heading">
                        <span>Pricing</span>

                        <h2>Recruitment Packages</h2>

                        <p>
                            Select a plan and send your requirement.
                        </p>
                    </div>

                    <div className="package-grid">
                        {packages.map((plan) => (
                            <div
                                className={`package-card
                                ${plan.popular ? "popular" : ""}
                                ${selectedPlan?.name === plan.name
                                        ? "selected-plan"
                                        : ""}`}
                                key={plan.name}
                            >
                                {plan.popular && (
                                    <span className="popular-tag">
                                        Most Popular
                                    </span>
                                )}

                                <h3>{plan.name}</h3>

                                <h2>{plan.price}</h2>

                                <p>{plan.jobs}</p>

                                <ul>
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>
                                            ✓ {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={() => handlePlanSelect(plan)}>
                                    {selectedPlan?.name === plan.name
                                        ? "Selected"
                                        : "Choose Plan"}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="faq-section">
                    <div className="section-heading">
                        <span>FAQ</span>
                        <h2>Frequently Asked Questions</h2>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div className="faq-item" key={index}>
                                <button
                                    onClick={() =>
                                        setOpenFaq(
                                            openFaq === index ? null : index
                                        )
                                    }
                                >
                                    {faq.q}

                                    <span>
                                        {openFaq === index ? "-" : "+"}
                                    </span>
                                </button>

                                {openFaq === index && (
                                    <p>{faq.a}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className="contact-section"
                    id="recruitment-contact"
                >
                    <div className="contact-info-box">
                        <span>Contact Sales</span>

                        <h2>
                            Submit Hiring Requirement
                        </h2>

                        <p>
                            Fill the form and our recruitment team
                            will contact you soon.
                        </p>

                        {selectedPlan && (
                            <div className="selected-box">
                                Selected Plan:
                                <b> {selectedPlan.name}</b>
                            </div>
                        )}
                    </div>

                    <form
                        className="recruitment-form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            name="company"
                            placeholder="Company Name *"
                            value={formData.company}
                            onChange={handleChange}
                        />

                        {errors.company && (
                            <small>{errors.company}</small>
                        )}

                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name *"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        {errors.name && (
                            <small>{errors.name}</small>
                        )}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address *"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {errors.email && (
                            <small>{errors.email}</small>
                        )}

                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength="10"
                            name="phone"
                            placeholder="Phone Number *"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        {errors.phone && (
                            <small>{errors.phone}</small>
                        )}

                        <select
                            name="employees"
                            value={formData.employees}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Hiring Size *
                            </option>

                            <option value="1-5">
                                1 - 5 Candidates
                            </option>

                            <option value="6-20">
                                6 - 20 Candidates
                            </option>

                            <option value="21-50">
                                21 - 50 Candidates
                            </option>

                            <option value="50+">
                                50+ Candidates
                            </option>
                        </select>

                        {errors.employees && (
                            <small>{errors.employees}</small>
                        )}

                        <textarea
                            name="requirement"
                            placeholder="Tell us about your hiring requirement"
                            value={formData.requirement}
                            onChange={handleChange}
                        ></textarea>

                        <button type="submit">
                            Submit Requirement
                        </button>
                    </form>
                </section>

                {enquiries.length > 0 && (
                    <section className="enquiry-section">
                        <div className="section-heading">
                            <span>Saved Data</span>
                            <h2>Submitted Enquiries</h2>
                        </div>

                        <button
                            className="clear-btn"
                            onClick={clearEnquiries}
                        >
                            Clear All Enquiries
                        </button>

                        <div className="enquiry-list">
                            {enquiries.map((item) => (
                                <div
                                    className="enquiry-card"
                                    key={item.id}
                                >
                                    <h3>{item.company}</h3>

                                    <p>
                                        <b>Name:</b> {item.name}
                                    </p>

                                    <p>
                                        <b>Email:</b> {item.email}
                                    </p>

                                    <p>
                                        <b>Phone:</b> {item.phone}
                                    </p>

                                    <p>
                                        <b>Hiring Size:</b> {item.employees}
                                    </p>

                                    <p>
                                        <b>Plan:</b> {item.selectedPlan}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </>
    );
};

export default RecruitmentSolutions;