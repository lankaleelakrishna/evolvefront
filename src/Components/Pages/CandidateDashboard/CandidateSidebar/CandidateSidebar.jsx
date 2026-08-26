import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config/api";
import {
  FaUser,
  FaSearch,
  FaBookmark,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaChartLine,
} from "react-icons/fa";
import "./CandidateSidebar.css";

const CandidateSidebar = ({ activeMenu, onChangeMenu }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const email =
      localStorage.getItem("userEmail") || localStorage.getItem("email");

    if (email) {
      setProfilePhoto(
        `${API_BASE_URL}/api/profile/photo/${encodeURIComponent(
          email
        )}?t=${Date.now()}`
      );
    }
  }, []);

  const handleMenuClick = (menu) => {
    onChangeMenu(menu);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <button
        className="candidateDashboardHamburger"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`candidateDashboardSidebarOverlay ${
          isSidebarOpen ? "show" : ""
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside
        className={`candidateDashboardSidebar ${
          isSidebarOpen ? "showSidebar" : ""
        }`}
      >
        <div className="candidateDashboardSidebarTop">
          <div className="candidateDashboardLogoBox">
            <div className="candidateDashboardLogoIcon">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Candidate"
                  className="candidateDashboardProfileImage"
                  onError={() => setProfilePhoto(null)}
                />
              ) : (
                "C"
              )}
            </div>

            <div>
              <h2 className="candidateDashboardLogoText">Candidate Panel</h2>
              <p className="candidateDashboardLogoSubtext">Job Portal</p>
            </div>
          </div>

          <ul className="candidateDashboardSidebarMenu">
            <li
              className={activeMenu === "profile" ? "active" : ""}
              onClick={() => handleMenuClick("profile")}
            >
              <FaUser />
              <span>Profile</span>
            </li>

            <li
              className={activeMenu === "jobs" ? "active" : ""}
              onClick={() => handleMenuClick("jobs")}
            >
              <FaSearch />
              <span>Search Jobs/Internships</span>
            </li>

            <li
              className={activeMenu === "saved" ? "active" : ""}
              onClick={() => handleMenuClick("saved")}
            >
              <FaBookmark />
              <span>Saved Jobs</span>
            </li>

            <li
              className={activeMenu === "applications" ? "active" : ""}
              onClick={() => handleMenuClick("applications")}
            >
              <FaClipboardList />
              <span>Application Status</span>
            </li>

            <li
              className={activeMenu === "mockResult" ? "active" : ""}
              onClick={() => handleMenuClick("mockResult")}
            >
              <FaChartLine />
              <span>Mock Interview Result</span>
            </li>
          </ul>
        </div>

        <div className="candidateDashboardSidebarBottom">
          <div className="candidateDashboardAdminProfile">
            <div className="candidateDashboardAdminAvatar">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Candidate"
                  className="candidateDashboardSmallProfileImage"
                  onError={() => setProfilePhoto(null)}
                />
              ) : (
                "CV"
              )}
            </div>

            <div>
              <h4>Candidate</h4>
              <p>Job Seeker</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CandidateSidebar;