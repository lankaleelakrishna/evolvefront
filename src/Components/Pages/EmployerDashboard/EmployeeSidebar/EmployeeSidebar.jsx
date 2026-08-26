import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaPlusCircle,
  FaBriefcase,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./EmployeeSidebar.css";

const EmployeeSidebar = ({ activeMenu, onMenuChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    fetch(`http://localhost:8080/api/company-profile/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logo) {
          setCompanyLogo(data.logo);
        }
      })
      .catch((error) => {
        console.error("Error fetching company logo:", error);
      });
  }, []);

  const handleMenuClick = (menu) => {
    if (onMenuChange) {
      onMenuChange(menu);
    }

    setIsSidebarOpen(false);
  };

  const getLogoSrc = () => {
    if (!companyLogo) return "";

    if (companyLogo.startsWith("data:image")) {
      return companyLogo;
    }

    return `data:image/jpeg;base64,${companyLogo}`;
  };

  return (
    <>
      <button
        className="employeeDashboardHamburger"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`employeeDashboardSidebarOverlay ${
          isSidebarOpen ? "show" : ""
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside
        className={`employeeDashboardSidebar ${
          isSidebarOpen ? "showSidebar" : ""
        }`}
      >
        <div className="employeeDashboardSidebarTop">
          <div className="employeeDashboardLogoBox">
            <div className="employeeDashboardLogoIcon">
              {companyLogo ? (
                <img
                  src={getLogoSrc()}
                  alt="Company Logo"
                  className="employeeDashboardCompanyLogo"
                />
              ) : (
                <span className="employeeDashboardDefaultLogo">E</span>
              )}
            </div>

            <div>
              <h2 className="employeeDashboardLogoText">Recruiter Panel</h2>
              <p className="employeeDashboardLogoSubtext">Job Portal</p>
            </div>
          </div>

          <ul className="employeeDashboardSidebarMenu">
            <li
              className={activeMenu === "profile" ? "active" : ""}
              onClick={() => handleMenuClick("profile")}
            >
              <FaBuilding />
              <span>Company Profile</span>
            </li>

            <li
              className={activeMenu === "postJob" ? "active" : ""}
              onClick={() => handleMenuClick("postJob")}
            >
              <FaPlusCircle />
              <span>Post New Job</span>
            </li>

            <li
              className={activeMenu === "manageJobs" ? "active" : ""}
              onClick={() => handleMenuClick("manageJobs")}
            >
              <FaBriefcase />
              <span>Edit / Delete Jobs</span>
            </li>

            <li
              className={activeMenu === "applicants" ? "active" : ""}
              onClick={() => handleMenuClick("applicants")}
            >
              <FaUsers />
              <span>Applicant List</span>
            </li>
          </ul>
        </div>

        <div className="employeeDashboardSidebarBottom">
          <div className="employeeDashboardAdminProfile">
            <div className="employeeDashboardAdminAvatar">HR</div>
            <div>
              <h4>Employer</h4>
              <p>Hiring Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;