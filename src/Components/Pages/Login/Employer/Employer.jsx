
import React from "react";
import "./Employer.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Footer/Footer";
import NavBar from "../../../HomePage/NavBar/NavBar";

const EmployerLogin = () => {
    const navigate= useNavigate();
    return (
        <>
    <NavBar/>
        <div className="Employer-login">
            <div className="Employerlogin-wrapper">
                <div className="Employer-login-card">
                    <h2 className="Employer-login-title">Employer Login</h2>

                    <form className="Employer-login-form">

                        <div className="Employer-login-input-box">
                            <FaUser className="Employer-login-icon" />
                            <input type="text" placeholder="Username" required />
                        </div>

                        <div className="Employer-login-input-box">
                            <FaLock className="Employer-login-icon" />
                            <input type="password" placeholder="Password" required />
                        </div>

                        <div className="Employer-login-forgot-container">
                            <span className="Employer-login-forgot-link" onClick={() => navigate("/ForgotPassword")}>
                                Forgot Password?
                            </span>
                        </div>

                        <button type="submit" className="Employer-login-btn">
                            Login
                        </button>

                        <p className="Employer-login-signup-text">
                            Don’t have an account? <span onClick={()=>navigate(`/register`)}>Sign in</span>
                        </p>

                    </form>
                </div>
            </div>
        </div>
            <Footer/>
        </>
       
    );
};

export default EmployerLogin;

