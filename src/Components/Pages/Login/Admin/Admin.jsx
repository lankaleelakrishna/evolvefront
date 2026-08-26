import React from "react";
import "./Admin.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Footer/Footer";
import NavBar from "../../../HomePage/NavBar/NavBar";

const Adminlogin = () => {
    const navigate = useNavigate();
    return (
        <>
        <NavBar/>
        <div className="Admin-login">
            <div className="Adminlogin-wrapper">
                <div className="Admin-login-card">
                    <h2 className="Admin-login-title">Admin Login</h2>

                    <form className="Admin-login-form">

                        <div className="Admin-login-input-box">
                            <FaUser className="Admin-login-icon" />
                            <input type="text" placeholder="Username" required />
                        </div>

                        <div className="Admin-login-input-box">
                            <FaLock className="Admin-login-icon" />
                            <input type="password" placeholder="Password" required />
                        </div>

                        <div className="Admin-login-forgot-container">
                            <span className="Admin-login-forgot-link" onClick={() => navigate("/ForgotPassword")}>
                                Forgot Password?
                            </span>
                        </div>

                        <button type="submit" className="Admin-login-btn">
                            Login
                        </button>

                        <p className="Admin-login-signup-text">
                            Don’t have an account? <span onClick={() => navigate(`/register`)}>Sign in</span>
                        </p>

                    </form>
                </div>
            </div>
        </div>
       
        <Footer/>
        </>
    );
};

export default Adminlogin;

