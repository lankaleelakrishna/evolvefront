import React, { useState } from "react";
import { API_BASE_URL } from "../../../config/api";
import "./ContactUs.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import axios from "axios";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        const nameRegex = /^[A-Za-z\s]+$/;
        const subjectRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!nameRegex.test(formData.name.trim())) {
            newErrors.name = "Name should contain only letters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Enter valid email address";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (!subjectRegex.test(formData.subject.trim())) {
            newErrors.subject = "Subject should contain only letters";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message should be minimum 10 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;

        if (name === "name") {
            updatedValue = value.replace(/[^A-Za-z\s]/g, "");
        }

        if (name === "subject") {
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            await axios.post(
                `${API_BASE_URL}/api/contact/details`,
                formData
            );

            setShowModal(true);

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            setErrors({});
        } catch (err) {
            console.error("Error sending message:", err);

            setError("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar></NavBar>

            <div className="contact-page">
                <div className="contact-hero">
                    <span className="contact-badge">
                        EVOLVE Support
                    </span>

                    <h1>Contact Us</h1>

                    <p>
                        Have questions about jobs, applications, hiring, or your account?
                        Our team is ready to help you.
                    </p>
                </div>

                <div className="contact-container">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>

                        <p>
                            Connect with Evolve for job search support, employer help,
                            technical issues, or general platform queries.
                        </p>

                        <div className="info-list">
                            <div className="info-item">
                                <div className="info-icon">📍</div>

                                <div>
                                    <h4>Office Location</h4>
                                    <span>Hyderabad, India</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">📧</div>

                                <div>
                                    <h4>Email Support</h4>
                                    <span>hirenex5@gmail.com</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">📞</div>

                                <div>
                                    <h4>Phone Number</h4>
                                    <span>+91 63014 08578</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">⏰</div>

                                <div>
                                    <h4>Working Hours</h4>
                                    <span>Mon - Sat, 9:00 AM - 6:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <h2>Send Message</h2>

                        <p className="form-subtitle">
                            Fill out the form below and we will respond as soon as possible.
                        </p>

                        {error && (
                            <p
                                style={{
                                    color: "red",
                                    marginBottom: "10px",
                                }}
                            >
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Name</label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />

                                    {errors.name && (
                                        <small style={{ color: "red" }}>
                                            {errors.name}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Your Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                    {errors.email && (
                                        <small style={{ color: "red" }}>
                                            {errors.email}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Subject</label>

                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Enter subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />

                                {errors.subject && (
                                    <small style={{ color: "red" }}>
                                        {errors.subject}
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Message</label>

                                <textarea
                                    name="message"
                                    placeholder="Write your message..."
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>

                                {errors.message && (
                                    <small style={{ color: "red" }}>
                                        {errors.message}
                                    </small>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="contact-btn"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="success-modal">
                            <div className="modal-icon">✓</div>

                            <h2>
                                Message Sent Successfully!
                            </h2>

                            <p>
                                Thank you for contacting Evolve.
                                Our support team will get back to you soon.
                            </p>

                            <button
                                onClick={() => setShowModal(false)}
                            >
                                Okay, Got It
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer></Footer>
        </>
    );
};

export default ContactUs;