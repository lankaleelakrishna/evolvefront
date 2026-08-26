// src/Components/HomePage/Jobs/Jobs_navbar/JobsNavBar.jsx
import React, { useEffect, useState } from "react";
import "./JobsNavBar.css";
import Logo from "../../../../assets/Logo.png";
import { IoMdSearch } from "react-icons/io";

const JobsNavBar = ({ searchValue = "", onSearchChange }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    window.location.href = "/";
  };

  return (
    <nav className="jobs-navbar">
      <div className="jobs-navbar-left">
        <div
          className="jobs-navbar-logo"
          onClick={() => (window.location.href = "/")}
        >
          <img src={Logo} alt="Job Portal Logo" className="jobs-logo-img" />
          <span className="jobs-logo-text">After Graduate</span>
        </div>

        <div className="jobs-navbar-search-wrapper">
          <div className="jobs-navbar-search">
            <IoMdSearch className="jobs-search-icon" />
            <input
              type="text"
              placeholder="Job title, company, skills..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <ul className="jobs-navbar-menu">
        {!role && (
          <>
            <li>
              <button
                type="button"
                className="jobs-login-btn"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </button>
            </li>
            <li>
              <button
                type="button"
                className="jobs-register-btn"
                onClick={() => (window.location.href = "/register")}
              >
                Register
              </button>
            </li>
          </>
        )}

        {role && (
          <>
            {role === "candidate" && (
              <li>
                <a href="/my-applications">My Applications</a>
              </li>
            )}
            {role === "employer" && (
              <>
                <li><a href="/post-job">Post Job</a></li>
                <li><a href="/manage-jobs">Manage Jobs</a></li>
              </>
            )}
            {role === "admin" && (
              <>
                <li><a href="/admin-dashboard">Admin Dashboard</a></li>
                <li><a href="/manage-users">Manage Users</a></li>
              </>
            )}
            <li className="jobs-logout" onClick={handleLogout}>
              Logout
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default JobsNavBar;
