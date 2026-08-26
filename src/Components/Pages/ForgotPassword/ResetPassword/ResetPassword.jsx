import React, { useState } from "react";
import { API_BASE_URL } from "../../../../config/api";
import "./ResetPassword.css";
import {
    HiOutlineArrowLeft,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineLockClosed,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../../HomePage/NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetEmail = localStorage.getItem("resetEmail");

    const validatePassword = () => {
        if (!resetEmail) return "Email verification is required. Please verify OTP again.";
        if (!newPassword.trim()) return "New password is required.";
        if (newPassword.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(newPassword)) return "Password must contain one uppercase letter.";
        if (!/[a-z]/.test(newPassword)) return "Password must contain one lowercase letter.";
        if (!/[0-9]/.test(newPassword)) return "Password must contain one number.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            return "Password must contain one special character.";
        }
        if (!confirmPassword.trim()) return "Confirm password is required.";
        if (newPassword !== confirmPassword) return "New password and confirm password do not match.";

        return "";
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validatePassword();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/api/aftergrad/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: resetEmail,
                    newPassword: newPassword,
                }),
            });

            const data = await response.text();

            if (!response.ok) {
                setError(data || "Failed to reset password.");
                return;
            }

            setSuccess("Password reset successfully. Redirecting to login...");
            localStorage.removeItem("resetEmail");

            setTimeout(() => {
                navigate("/login/candidate");
            }, 1500);
        } catch (error) {
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />

            <div className="reset-page">
                <div className="reset-overlay"></div>

                <div className="reset-container">
                    <div className="reset-left">
                        <div className="reset-left-content">
                            <div className="reset-brand">
                                <span className="reset-brand-dot"></span>
                                <h2>AfterGraduate</h2>
                            </div>

                            <h1>Create your new secure password</h1>
                            <p>
                                Your OTP has been verified. Set a strong password to protect your
                                account and continue using AfterGraduate securely.
                            </p>

                            <div className="reset-features">
                                <div className="reset-feature-card">
                                    <span>✓</span>
                                    <p>Minimum 8 characters required</p>
                                </div>
                                <div className="reset-feature-card">
                                    <span>✓</span>
                                    <p>Use uppercase, lowercase and number</p>
                                </div>
                                <div className="reset-feature-card">
                                    <span>✓</span>
                                    <p>Special character improves security</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="reset-right">
                        <div className="reset-card">
                            <Link to="/forgot-password" className="reset-back">
                                <HiOutlineArrowLeft />
                                <span>Back to Forgot Password</span>
                            </Link>

                            <div className="reset-logo">
                                <span className="logo-dot"></span>
                                <h3>AfterGraduate</h3>
                            </div>

                            <h2>Reset Password</h2>
                            <p className="reset-subtext">
                                Enter your new password and confirm it to update your account.
                            </p>

                            <form className="reset-form" onSubmit={handleResetPassword}>
                                <label>New Password</label>

                                <div className="reset-input-box">
                                    <HiOutlineLockClosed className="reset-input-icon" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="reset-eye-btn"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                                    </button>
                                </div>

                                <label>Confirm Password</label>

                                <div className="reset-input-box">
                                    <HiOutlineLockClosed className="reset-input-icon" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="reset-eye-btn"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                    >
                                        {showConfirmPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                                    </button>
                                </div>

                                {error && <p className="reset-error">{error}</p>}
                                {success && <p className="reset-success">{success}</p>}

                                <button type="submit" className="reset-btn" disabled={loading}>
                                    {loading ? "Saving..." : "Save Password"}
                                </button>
                            </form>

                            <div className="reset-footer-text">
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

export default ResetPassword;