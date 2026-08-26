import React, { useEffect, useRef, useState } from "react";
import "./NavBar.css";
import Logo from "../../../assets/evlove logo.png";

import {
  FaUserCircle,
  FaSignOutAlt,
  FaEnvelope,
  FaChevronDown,
  FaKey,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NavBar() {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const navigate = useNavigate();

  const profileRef = useRef(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    const storedName =
      localStorage.getItem("name") ||
      localStorage.getItem("username") ||
      "User";

    const storedEmail =
      localStorage.getItem("userEmail") ||
      localStorage.getItem("email") ||
      "user@example.com";

    const userId = localStorage.getItem("userId");

    if (storedRole) {
      const lowerRole = storedRole.toLowerCase();

      setRole(storedRole);
      setUserName(storedName);
      setUserEmail(storedEmail);

      if (lowerRole === "candidate" && storedEmail) {
        setProfilePhoto(
          `http://localhost:8080/api/profile/photo/${encodeURIComponent(
            storedEmail
          )}?t=${Date.now()}`
        );
      } else if (lowerRole === "employee" && userId) {
        fetch(`http://localhost:8080/api/company-profile/user/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.logo) {
              if (data.logo.startsWith("data:image")) {
                setProfilePhoto(data.logo);
              } else {
                setProfilePhoto(`data:image/jpeg;base64,${data.logo}`);
              }
            } else {
              setProfilePhoto(null);
            }
          })
          .catch((error) => {
            console.error("Error fetching employee company logo:", error);
            setProfilePhoto(null);
          });
      } else {
        setProfilePhoto(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    if (token && currentRole === "admin") {
      try {
        await axios.post(
          "http://localhost:8080/api/admin-session/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Admin logout API error:", error);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    setRole(null);
    setProfilePhoto(null);
    setShowProfileMenu(false);
    setShowSettingsMenu(false);

    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowSettingsMenu(false);
  };

  const handleDashboardNavigate = () => {
    const userRole = role?.toLowerCase();

    setShowProfileMenu(false);
    setShowSettingsMenu(false);

    if (userRole === "candidate") {
      navigate("/candidate-dashboard");
    } else if (userRole === "employee") {
      navigate("/employee-dashboard");
    } else if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else if (userRole === "super_admin") {
      navigate("/super-admin-dashboard");
    }
  };

  const handleEditProfile = () => {
    const userRole = role?.toLowerCase();

    setShowProfileMenu(false);
    setShowSettingsMenu(false);

    if (userRole === "candidate") {
      navigate("/candidate-dashboard");
    } else if (userRole === "employee") {
      navigate("/company-profile");
    } else if (userRole === "admin") {
      navigate("/admin-profile");
    } else if (userRole === "super_admin") {
      navigate("/super-admin-profile");
    }
  };

  const handleChangePassword = () => {
    setShowProfileMenu(false);
    setShowSettingsMenu(false);
    navigate("/change-password");
  };

  return (
    <nav className="navbar">
      <div className="navbar-glow"></div>

      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={Logo} alt="Evolve Logo" className="navbar-full-logo" />
        </div>
      </div>

      <ul className="navbar-menu">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        {/* <li className="career-dropdown-wrapper" ref={careerRef}>
          <button
            type="button"
            className="career-dropdown-btn"
            onClick={() => setShowCareerDropdown(!showCareerDropdown)}
          >
            Careers <FaChevronDown />
          </button>

          {showCareerDropdown && (
            <div className="career-dropdown-menu">
              <NavLink to="/jobs" onClick={() => setShowCareerDropdown(false)}>
                Jobs
              </NavLink>

              <NavLink
                to="/InternshipPage"
                onClick={() => setShowCareerDropdown(false)}
              >
                Internships
              </NavLink>
            </div>
          )}
        </li> */}

         <li>
          <NavLink to="/jobs">Jobs</NavLink>
        </li>

        <li>
          <NavLink to="/InternshipPage">Interships</NavLink>
        </li>

        <li>
          <NavLink to="/CompanyPage">Companies</NavLink>
        </li>

        <li>
          <NavLink to="/course-page">Courses</NavLink>
        </li>

        {!role ? (
          <li>
            <NavLink className="login-btn" to="/login/candidate">
              Login / Register
            </NavLink>
          </li>
        ) : (
          <li className="profile-wrapper" ref={profileRef}>
            <div
              className="profile-trigger"
              onClick={handleProfileClick}
              title="Profile"
            >
              <div className="profile-trigger-ring">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="navbar-profile-img"
                    onError={() => setProfilePhoto(null)}
                  />
                ) : (
                  <FaUserCircle className="profile-icon" />
                )}
              </div>
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-top">
                  <div className="profile-avatar-wrap">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="navbar-dropdown-profile-img"
                        onError={() => setProfilePhoto(null)}
                      />
                    ) : (
                      <FaUserCircle className="profile-dropdown-icon" />
                    )}
                  </div>

                  <div className="profile-user-details">
                    <h4>{userName}</h4>

                    <span className="profile-role-badge">
                      {role
                        ? role.charAt(0).toUpperCase() + role.slice(1)
                        : "User"}
                    </span>

                    <p>
                      <FaEnvelope className="email-icon" />
                      {userEmail}
                    </p>
                  </div>
                </div>

                <button
                  className="profile-logout-btn"
                  onClick={handleDashboardNavigate}
                >
                  <FaUserCircle />
                  My Dashboard
                </button>

                <div className="settings-menu-wrapper">
                  <button
                    type="button"
                    className="profile-logout-btn"
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  >
                    <FaKey />
                    Settings & Privacy
                    <FaChevronDown className="settings-arrow" />
                  </button>

                  {showSettingsMenu && (
                    <div className="settings-submenu">
                      <button
                        type="button"
                        className="settings-submenu-btn"
                        onClick={handleEditProfile}
                      >
                        <FaUserCircle />
                        Edit Profile
                      </button>

                      <button
                        type="button"
                        className="settings-submenu-btn"
                        onClick={handleChangePassword}
                      >
                        <FaKey />
                        Change Password
                      </button>
                    </div>
                  )}
                </div>

                <button className="profile-logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}