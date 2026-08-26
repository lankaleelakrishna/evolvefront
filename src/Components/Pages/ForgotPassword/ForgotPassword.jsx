import React, { useState } from "react";
import "./ForgotPassword.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import { HiOutlineArrowLeft, HiOutlineEnvelope, HiOutlineKey } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Email address is required");
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:8080/api/aftergrad/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.text();

            if (!response.ok) {
                setError(data || "Failed to send OTP");
                return;
            }

            setOtpSent(true);
            setMessage("OTP has been sent to your registered email address.");
        } catch (error) {
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!otp.trim()) {
            setError("OTP is required");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("OTP must contain 6 digits only");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:8080/api/aftergrad/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.text();

            if (!response.ok) {
                setError(data || "Invalid OTP");
                return;
            }

            localStorage.setItem("resetEmail", email);
            navigate("/reset-password");
        } catch (error) {
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />

            <div className="forgot-page">
                <div className="forgot-overlay"></div>

                <div className="forgot-container">
                    <div className="forgot-left">
                        <div className="forgot-left-content">
                            <div className="forgot-brand">
                                <span className="forgot-brand-dot"></span>
                                <h2>AfterGraduate</h2>
                            </div>

                            <h1>Reset your password easily</h1>
                            <p>
                                Don’t worry if you forgot your password. Enter your registered
                                email address and verify OTP to reset your password securely.
                            </p>

                            <div className="forgot-features">
                                <div className="forgot-feature-card">
                                    <span>✓</span>
                                    <p>Secure password reset process</p>
                                </div>
                                <div className="forgot-feature-card">
                                    <span>✓</span>
                                    <p>Quick email OTP verification</p>
                                </div>
                                <div className="forgot-feature-card">
                                    <span>✓</span>
                                    <p>Fast access back to your account</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="forgot-right">
                        <div className="forgot-card">
                            <Link to="/login" className="forgot-back">
                                <HiOutlineArrowLeft />
                                <span>Back to Login</span>
                            </Link>

                            <div className="forgot-logo">
                                <span className="logo-dot"></span>
                                <h3>AfterGraduate</h3>
                            </div>

                            <h2>Forgot Password</h2>
                            <p className="forgot-subtext">
                                Enter your registered email address. We will send an OTP to verify
                                your account.
                            </p>

                            {!otpSent ? (
                                <form className="forgot-form" onSubmit={handleSendOtp}>
                                    <label>Email Address</label>

                                    <div className="forgot-input-box">
                                        <HiOutlineEnvelope className="forgot-input-icon" />
                                        <input
                                            type="email"
                                            placeholder="Please enter your e-mail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    {error && <p className="forgot-error">{error}</p>}
                                    {message && <p className="forgot-success">{message}</p>}

                                    <button type="submit" className="forgot-btn" disabled={loading}>
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                    </button>
                                </form>
                            ) : (
                                <form className="forgot-form" onSubmit={handleVerifyOtp}>
                                    <label>Email Address</label>

                                    <div className="forgot-input-box">
                                        <HiOutlineEnvelope className="forgot-input-icon" />
                                        <input type="email" value={email} disabled />
                                    </div>

                                    <label>Enter OTP</label>

                                    <div className="forgot-input-box">
                                        <HiOutlineKey className="forgot-input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Enter 6 digit OTP"
                                            value={otp}
                                            maxLength="6"
                                            onChange={(e) =>
                                                setOtp(e.target.value.replace(/\D/g, ""))
                                            }
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="forgot-resend-btn"
                                        onClick={handleSendOtp}
                                        disabled={loading}
                                    >
                                        Resend OTP
                                    </button>

                                    {error && <p className="forgot-error">{error}</p>}
                                    {message && <p className="forgot-success">{message}</p>}

                                    <button type="submit" className="forgot-btn" disabled={loading}>
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </form>
                            )}

                            <div className="forgot-footer-text">
                                Remember your password? <Link to="/login/candidate">Sign In</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ForgotPassword;