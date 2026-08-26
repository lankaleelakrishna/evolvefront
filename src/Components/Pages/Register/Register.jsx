import React, { useState } from "react";
import "./Register.css";

import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    role: "CANDIDATE",
    workStatus: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const sanitizeInput = (value) => {
    return value.replace(/[<>]/g, "").trimStart();
  };

  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;

    return passwordPattern.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = sanitizeInput(value);

    if (name === "mobile") {
      sanitizedValue = sanitizedValue.replace(/\D/g, "");
    }

    if (name === "fullName") {
      sanitizedValue = sanitizedValue.replace(/[^A-Za-z\s]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
      ...(name === "role" && value === "EMPLOYEE" ? { workStatus: "" } : {}),
    }));

    if (name === "email" || name === "mobile") {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
    }

    setError("");
    setMessage("");
  };

  const handleWorkStatus = (status) => {
    setFormData((prev) => ({
      ...prev,
      workStatus: status,
    }));

    setError("");
    setMessage("");
  };

  const validateOtpFields = () => {
    if (!formData.fullName.trim()) {
      return "Full Name is required.";
    }

    const namePattern = /^[A-Za-z\s]{3,50}$/;

    if (!namePattern.test(formData.fullName.trim())) {
      return "Full Name must contain only letters and spaces.";
    }

    if (!formData.email.trim()) {
      return "Email is required.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      return "Please enter valid email.";
    }

    const mobilePattern = /^[6-9]\d{9}$/;

    if (!mobilePattern.test(formData.mobile)) {
      return "Please enter valid mobile number.";
    }

    return "";
  };

  const validateForm = () => {
    const otpFieldError = validateOtpFields();

    if (otpFieldError) {
      return otpFieldError;
    }

    if (!validatePassword(formData.password)) {
      return "Password must contain uppercase, lowercase, number and special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Password and confirm password do not match.";
    }

    if (formData.role === "CANDIDATE" && !formData.workStatus) {
      return "Please select work status.";
    }

    return "";
  };

  const handleSendOtp = async () => {
    const validationError = validateOtpFields();

    if (validationError) {
      setError(validationError);
      return;
    }

    setOtpLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/otp/send?email=${formData.email}&mobile=${formData.mobile}&purpose=REGISTER`,
        {
          method: "POST",
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Failed to send OTP");
      }

      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");

      setMessage("OTP sent successfully to your email/mobile.");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    setOtpLoading(true);
    setError("");
    setMessage("");

    try {
      const emailResponse = await fetch(
        `http://localhost:8080/api/otp/verify?emailOrMobile=${formData.email}&otp=${otp}&purpose=REGISTER`,
        {
          method: "POST",
        }
      );

      const emailData = await emailResponse.text();

      if (!emailResponse.ok) {
        throw new Error(emailData || "Email OTP verification failed");
      }

      const mobileResponse = await fetch(
        `http://localhost:8080/api/otp/verify?emailOrMobile=${formData.mobile}&otp=${otp}&purpose=REGISTER`,
        {
          method: "POST",
        }
      );

      const mobileData = await mobileResponse.text();

      if (!mobileResponse.ok) {
        throw new Error(mobileData || "Mobile OTP verification failed");
      }

      setOtpVerified(true);
      setMessage("Email and mobile OTP verified successfully!");
    } catch (err) {
      setOtpVerified(false);
      setError(err.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    if (!otpVerified) {
      setError("Please verify OTP before registration.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobile: Number(formData.mobile),
        role: formData.role.toUpperCase(),
        workStatus: formData.role === "CANDIDATE" ? formData.workStatus : null,
      };

      const response = await fetch(
        "http://localhost:8080/api/aftergrad/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Registration failed");
      }

      setMessage("Registration successful!");

      setTimeout(() => {
        navigate("/login/candidate");
      }, 2500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <div
        className="register-page"
        style={{
          backgroundImage: `linear-gradient(rgba(49, 226, 43, 0.5), rgba(194, 11, 11, 0.5)), url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div className="register-container">
          <div className="left-panel">
            <h3>On registering, you can</h3>

            <ul>
              <li>✔ Build your profile and let recruiters find you</li>
              <li>✔ Get job postings delivered right to your email</li>
              <li>✔ Find a job and grow your career</li>
            </ul>
          </div>

          <div className="right-panel">
            <h2>Create your Job Portal profile</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={50}
              />

              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
              />

              <input
                type="tel"
                name="mobile"
                placeholder="+91 Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
              />

              <div className="input-with-button">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  disabled={!otpSent || otpVerified}
                />

                {!otpSent ? (
                  <button
                    type="button"
                    className="otp-btn"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="otp-btn"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otpVerified}
                  >
                    {otpVerified
                      ? "Verified"
                      : otpLoading
                      ? "Verifying..."
                      : "Verify OTP"}
                  </button>
                )}
              </div>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                maxLength={20}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={20}
              />

              <label className="work-label">Select Role</label>

              <select
                className="role-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="CANDIDATE">Candidate</option>
                <option value="EMPLOYEE">Employee</option>
              </select>

              {formData.role === "CANDIDATE" && (
                <>
                  <label className="work-label">Work status</label>

                  <div className="work-status">
                    <div
                      className={`status-card ${
                        formData.workStatus === "INTERN" ? "active" : ""
                      }`}
                      onClick={() => handleWorkStatus("INTERN")}
                    >
                      <h4>I'm intern</h4>
                      <p>I am a student / Haven't worked till now</p>
                    </div>

                    <div
                      className={`status-card ${
                        formData.workStatus === "FRESHER" ? "active" : ""
                      }`}
                      onClick={() => handleWorkStatus("FRESHER")}
                    >
                      <h4>I'm a fresher</h4>
                      <p>I am a student / Haven't worked after graduation</p>
                    </div>

                    <div
                      className={`status-card ${
                        formData.workStatus === "EXPERIENCED" ? "active" : ""
                      }`}
                      onClick={() => handleWorkStatus("EXPERIENCED")}
                    >
                      <h4>I'm experienced</h4>
                      <p>I have work experience (excluding internships)</p>
                    </div>
                  </div>
                </>
              )}

              {error && <p className="error-message">{error}</p>}
              {message && <p className="success-message">{message}</p>}

              <button className="register" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register now"}
              </button>

              <p className="terms">
                By clicking Register, you agree to our Terms & Conditions
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;