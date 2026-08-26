import React, { useState } from "react";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";
import { FaLock, FaShieldAlt, FaArrowLeft } from "react-icons/fa";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.currentPassword.trim() ||
      !formData.newPassword.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("All fields are required");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(formData.newPassword)) {
      setError(
        "Password must contain minimum 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const email =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email");

      const role = localStorage.getItem("role");

      if (!email) {
        setError("User email not found. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            role,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      let data = {};
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = {
          message: text || "Password change failed",
          success: false,
        };
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Password change failed");
      }

      setSuccess("Password changed successfully!");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <div className="change-password-page">
        <div className="change-password-card">
          <button
            type="button"
            className="change-password-back"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="change-password-icon">
            <FaShieldAlt />
          </div>

          <h2>Change Password</h2>

          <p className="change-password-subtitle">
            Update your password to keep your account secure.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Current Password</label>

            <div className="change-password-input-box">
              <FaLock />
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            <label>New Password</label>

            <div className="change-password-input-box">
              <FaLock />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            <label>Confirm Password</label>

            <div className="change-password-input-box">
              <FaLock />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            {error && <p className="change-password-error">{error}</p>}

            {success && (
              <p className="change-password-success">{success}</p>
            )}

            <button
              type="submit"
              className="change-password-submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePassword;