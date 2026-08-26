import React, { useState } from "react";
import { API_BASE_URL } from "../../../../config/api";
import "./Candidate.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../HomePage/NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const Candidatelogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    /*
     * 2 FACTOR AUTHENTICATION - OTP STATES COMMENTED
     *
     * const [showOtpModal, setShowOtpModal] = useState(false);
     * const [otp, setOtp] = useState("");
     * const [tempUserData, setTempUserData] = useState(null);
     */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
        setSuccessMessage("");
    };

    const saveLoginData = (data, roleValue) => {
        if (!data.token) {
            throw new Error("JWT token not received from backend");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", roleValue);
        localStorage.setItem("name", data.name || "");
        localStorage.setItem("userEmail", data.email || "");

        if (data.id || data.userId) {
            localStorage.setItem("userId", String(data.id || data.userId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccessMessage("");

        if (!formData.username.trim() || !formData.password.trim()) {
            setError("Please enter email/mobile and password.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailOrMobile: formData.username,
                    password: formData.password
                })
            });

            let data;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok || data.status === false || data.success === false) {
                throw new Error(data.message || "Invalid credentials");
            }

            /*
             * 2 FACTOR AUTHENTICATION - TEMP USER DATA COMMENTED
             *
             * setTempUserData({ ...data });
             */

            setError("");

            const role = data.role?.toUpperCase();

            if (role === "ADMIN") {
                saveLoginData(data, "admin");

                setSuccessMessage("Admin login successful!");

                setTimeout(() => {
                    navigate("/admin-dashboard");
                }, 500);

                return;
            }

            if (role === "SUPER_ADMIN") {
                saveLoginData(data, "super_admin");

                setSuccessMessage("Super Admin login successful!");

                setTimeout(() => {
                    navigate("/super-admin-dashboard");
                }, 500);

                return;
            }

            /*
             * 2 FACTOR AUTHENTICATION - OTP SEND / SHOW MODAL COMMENTED
             *
             * const isEmailLogin = formData.username.includes("@");
             *
             * const otpMessage = isEmailLogin
             *     ? "OTP sent successfully to your email"
             *     : "OTP sent successfully to your mobile number";
             *
             * setSuccessMessage(otpMessage);
             *
             * setTimeout(() => {
             *     setShowOtpModal(true);
             * }, 1200);
             */

            if (role === "CANDIDATE") {
                saveLoginData(data, "candidate");

                setSuccessMessage("Candidate login successful!");

                setTimeout(() => {
                    navigate("/candidate-dashboard");
                }, 500);

                return;
            }

            if (role === "EMPLOYEE") {
                saveLoginData(data, "employee");

                setSuccessMessage("Employee login successful!");

                setTimeout(() => {
                    navigate("/employee-dashboard");
                }, 500);

                return;
            }


            if (role === "VENDOR") {
    saveLoginData(data, "vendor");

    setSuccessMessage("Vendor login successful!");

    setTimeout(() => {
        navigate("/vendor-dashboard");
    }, 500);

    return;
}

            saveLoginData(data, role?.toLowerCase() || "");

            setSuccessMessage("Login successful!");

            setTimeout(() => {
                navigate("/");
            }, 500);

        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    /*
     * 2 FACTOR AUTHENTICATION - OTP VERIFY FUNCTION COMMENTED
     *
     * const handleVerifyOtp = async () => {
     *     if (!otp) {
     *         setError("Please enter OTP");
     *         return;
     *     }
     *
     *     try {
     *         const response = await fetch(
     *             `${API_BASE_URL}/auth/verify-login-otp?emailOrMobile=${formData.username}&otp=${otp}`,
     *             {
     *                 method: "POST",
     *             }
     *         );
     *
     *         let data;
     *         const contentType = response.headers.get("content-type");
     *
     *         if (contentType && contentType.includes("application/json")) {
     *             data = await response.json();
     *         } else {
     *             const text = await response.text();
     *             throw new Error(text || "Invalid OTP");
     *         }
     *
     *         if (!response.ok) {
     *             throw new Error(data.message || "Invalid OTP");
     *         }
     *
     *         if (!data.token) {
     *             throw new Error("JWT token not received from backend");
     *         }
     *
     *         localStorage.setItem("token", data.token);
     *         localStorage.setItem("role", data.role?.toLowerCase());
     *         localStorage.setItem("name", data.name || "");
     *         localStorage.setItem("userEmail", data.email || "");
     *
     *         const userId = data.id || data.userId;
     *
     *         if (!userId) {
     *             alert("UserId not coming from backend");
     *             console.error("Missing userId in response:", data);
     *             return;
     *         }
     *
     *         localStorage.setItem("userId", String(userId));
     *
     *         setSuccessMessage("Login successful!");
     *         setShowOtpModal(false);
     *
     *         const role = data.role?.toUpperCase();
     *
     *         if (role === "CANDIDATE") {
     *             navigate("/candidate-dashboard");
     *         } else if (role === "EMPLOYEE") {
     *             navigate("/employee-dashboard");
     *         } else if (role === "ADMIN") {
     *             navigate("/admin-dashboard");
     *         } else if (role === "SUPER_ADMIN") {
     *             navigate("/super-admin-dashboard");
     *         } else {
     *             navigate("/");
     *         }
     *
     *     } catch (err) {
     *         setError(err.message);
     *     }
     * };
     */

    return (
        <>
            <NavBar />

            <div className="Candidate-login">
                <div className="Candidatelogin-wrapper">
                    <div className="Candidate-login-card">
                        <h2 className="Candidate-login-title">Login</h2>

                        <form className="Candidate-login-form" onSubmit={handleSubmit}>
                            <div className="Candidate-login-input-box">
                                <FaUser className="Candidate-login-icon" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Email/Mobile"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="Candidate-login-input-box">
                                <FaLock className="Candidate-login-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="Candidate-login-forgot-container">
                                <span
                                    className="Candidate-login-forgot-link"
                                    onClick={() => navigate("/ForgotPassword")}
                                >
                                    Forgot Password?
                                </span>
                            </div>

                            {error && <p className="Candidate-login-error">{error}</p>}
                            {successMessage && <p className="Candidate-login-success">{successMessage}</p>}

                            <button
                                type="submit"
                                className="Candidate-login-btn"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <p className="Candidate-login-signup-text">
                                Don’t have an account?{" "}
                                <span onClick={() => navigate("/register")}>
                                    Sign up
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/*
                2 FACTOR AUTHENTICATION - OTP MODAL COMMENTED

                {showOtpModal && (
                    <div className="otp-modal">
                        <div className="otp-box">
                            <h3>Enter OTP</h3>

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleVerifyOtp();
                                    }
                                }}
                            />

                            <button onClick={handleVerifyOtp} className="login-otp-btn">
                                Verify OTP
                            </button>

                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="otp-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            */}

            <Footer />
        </>
    );
};

export default Candidatelogin;