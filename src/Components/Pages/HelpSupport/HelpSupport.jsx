import React, { useMemo, useState } from "react";

import "./HelpSupport.css";

import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";

const supportCards = [
    {
        icon: "💼",
        title: "Job Applications",
        description: "Get help with applying, saving, and tracking your jobs.",
    },
    {
        icon: "👤",
        title: "Profile Support",
        description: "Update your profile, resume, education, and skills.",
    },
    {
        icon: "🏢",
        title: "Employer Help",
        description: "Support for posting jobs and managing candidates.",
    },
    {
        icon: "🔐",
        title: "Account Issues",
        description: "Resolve login, password, and account access problems.",
    },
];

const faqData = [
    {
        question: "How do I apply for a job?",
        answer: "Open any job details page and click the Apply Now button. Fill in the required details and submit your application.",
    },
    {
        question: "How can I save jobs?",
        answer: "Click the Save Job button on the job card or job details page. Saved jobs will be available in your Saved Jobs page.",
    },
    {
        question: "Can I update my profile details?",
        answer: "Yes, go to My Profile from your dashboard and update your personal, education, and experience details.",
    },
    {
        question: "How do I track my applications?",
        answer: "Open My Applications from your dashboard to view your applied jobs and application status.",
    },
    {
        question: "I forgot my password. What should I do?",
        answer: "Go to the Forgot Password page, enter your registered email, and follow the reset instructions.",
    },
];

const HelpSupport = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "",
        message: "",
    });

    const filteredFaqs = useMemo(() => {
        if (!searchText.trim()) return faqData;

        return faqData.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText]);

    const validateForm = () => {
        const newErrors = {};

        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!nameRegex.test(formData.name.trim())) {
            newErrors.name = "Name should contain only letters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.category.trim()) {
            newErrors.category = "Please select support category";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message should be at least 10 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleCardClick = (title) => {
        setSearchText(title);
        setOpenIndex(null);
    };

    const handleSupportClick = () => {
        document
            .getElementById("supportTicketForm")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;

        if (name === "name") {
            updatedValue = value.replace(/[^A-Za-z\s]/g, "");
        }

        setFormData({
            ...formData,
            [name]: updatedValue,
        });

        setErrors({
            ...errors,
            [name]: "",
        });

        setSuccessMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setSuccessMsg("");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:8080/api/support/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit support request");
            }

            await response.json();

            setSuccessMsg("Your support request has been submitted successfully!");

            setFormData({
                name: "",
                email: "",
                category: "",
                message: "",
            });

            setErrors({});
        } catch (error) {
            console.error("Submit error:", error);
            setSuccessMsg("Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />

            <div className="helpSupportPage">
                <section className="helpSupportHero">
                    <span className="helpSupportBadge">
                        Help Center
                    </span>

                    <h1>
                        How can we help you?
                    </h1>

                    <p>
                        Find answers, get support,
                        and learn how to use the Job Portal smoothly.
                    </p>

                    <div className="helpSupportSearch">
                        <input
                            type="text"
                            placeholder="Search help topics..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        {searchText && (
                            <button
                                type="button"
                                className="clearSearchBtn"
                                onClick={() => setSearchText("")}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </section>

                <section className="helpSupportCards">
                    {supportCards.map((card, index) => (
                        <div
                            className="helpSupportCard"
                            key={index}
                            onClick={() => handleCardClick(card.title)}
                        >
                            <div className="helpSupportIcon">
                                {card.icon}
                            </div>

                            <h3>
                                {card.title}
                            </h3>

                            <p>
                                {card.description}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="helpSupportContent">
                    <div className="helpSupportFaq">
                        <h2>
                            Frequently Asked Questions
                        </h2>

                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((item, index) => (
                                <div
                                    className={`faqItem ${
                                        openIndex === index ? "active" : ""
                                    }`}
                                    key={index}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(index)}
                                    >
                                        {item.question}

                                        <span>
                                            {openIndex === index ? "−" : "+"}
                                        </span>
                                    </button>

                                    {openIndex === index && (
                                        <p>
                                            {item.answer}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="noFaqFound">
                                <h3>
                                    No results found
                                </h3>

                                <p>
                                    Try searching for application,
                                    profile, password, or jobs.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="helpSupportBox">
                        <h2>
                            Need more help?
                        </h2>

                        <p>
                            Our support team is ready to assist you
                            with your job search or hiring needs.
                        </p>

                        <div className="supportInfo">
                            <span>📧</span>

                            <div>
                                <h4>
                                    Email Support
                                </h4>

                                <p>
                                    hirenex5@gmail.com
                                </p>
                            </div>
                        </div>

                        <div className="supportInfo">
                            <span>📞</span>

                            <div>
                                <h4>
                                    Phone Support
                                </h4>

                                <p>
                                    +91 63014 08578
                                </p>
                            </div>
                        </div>

                        <div className="supportInfo">
                            <span>⏰</span>

                            <div>
                                <h4>
                                    Working Hours
                                </h4>

                                <p>
                                    Monday - Saturday,
                                    9:00 AM - 6:00 PM
                                </p>
                            </div>
                        </div>

                        <button
                            className="supportBtn"
                            onClick={handleSupportClick}
                        >
                            Contact Support
                        </button>
                    </div>
                </section>

                <section
                    className="supportTicketSection"
                    id="supportTicketForm"
                >
                    <div className="supportTicketHeader">
                        <h2>
                            Submit a Support Request
                        </h2>

                        <p>
                            Fill the form below and our team
                            will contact you as soon as possible.
                        </p>
                    </div>

                    <form
                        className="supportTicketForm"
                        onSubmit={handleSubmit}
                    >
                        <div className="formRow">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                {errors.name && (
                                    <small>{errors.name}</small>
                                )}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                {errors.email && (
                                    <small>{errors.email}</small>
                                )}
                            </div>
                        </div>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Support Category
                            </option>

                            <option value="Job Application">
                                Job Application
                            </option>

                            <option value="Profile Issue">
                                Profile Issue
                            </option>

                            <option value="Saved Jobs">
                                Saved Jobs
                            </option>

                            <option value="Login Issue">
                                Login Issue
                            </option>

                            <option value="Employer Support">
                                Employer Support
                            </option>
                        </select>

                        {errors.category && (
                            <small>{errors.category}</small>
                        )}

                        <textarea
                            name="message"
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={handleChange}
                        ></textarea>

                        {errors.message && (
                            <small>{errors.message}</small>
                        )}

                        {successMsg && (
                            <p className="successMsg">
                                {successMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default HelpSupport;