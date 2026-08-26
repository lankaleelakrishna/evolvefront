import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";  
import {
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaClipboardList,
  FaHome,
  FaUser,
  FaChartBar,
  FaExclamationTriangle,
  FaCommentDots
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer/Footer";
import Logo from "../../../assets/Logo2.png";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState(false); 


  useEffect(() => {
    if (openSidebar) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [openSidebar]);

  return (
  
      <div className="admin-page">

        <div className="admin-navbar">

       <div className="hamburger" onClick={() => setOpenSidebar(true)}>
            ☰
          </div>

          {/* <div className="nav-links">
            <a onClick={() => navigate("/")}>Home</a>
            <a onClick={() => navigate("/jobs")}>Jobs</a>
            <a onClick={() => navigate("/CompanyPage")}>Companies</a>
            <button
              className="post-btn"
              onClick={() => navigate(`/PostJob`)}
            >
              Post a Job
            </button>
     </div>
        // </div> */}
        </div>

        <div className="admin-container" style={{ width: "100%", padding: "0%", margin: "0%" }}>

     
          <div className={`sidebar-mains ${openSidebar ? "open" : ""}`} style={{ width: "240px" }}>

            <div className="for-logo" style={{ marginTop: "20px" }}>
              <div
                className="navbar-logo"
                onClick={() => (window.location.href = "/")}
              >
                <img src={Logo} alt="Job Portal Logo" className="logo-img" />
                <span className="logo-texts">Aftergraduate</span>
              </div>
            </div>

            <div className="side-item active" style={{ marginTop: "35px" }}>
              <FaHome /> Dashboard
            </div>

            <div
              className="side-item"
              onClick={() => {
                navigate(`/users`);
                setOpenSidebar(false);
              }}
            >
              <FaUser /> Manage Users
            </div>

            <div
              className="side-item"
              onClick={() => {
                navigate(`/EmployerUser`);
                setOpenSidebar(false);
              }}
            >
              <FaBuilding /> Manage Employers
            </div>

            <div
              className="side-item"
              onClick={() => {
                navigate(`/ManageJobListing`);
                setOpenSidebar(false);
              }}
            >
              <FaBriefcase /> Manage Job Listings
            </div>

            <div className="side-item">
              <FaExclamationTriangle /> Reports & Feedback
            </div>
          </div>

             {openSidebar && (
            <div
              className="sidebar-overlay"
              onClick={() => setOpenSidebar(false)}
            />
          )}

       
          <div className="admin-main">
            <h1 style={{ marginTop: "40px" }}>Admin Dashboard</h1>

            <div className="stats" style={{ marginTop: "27px" }}>
              <div className="stat-card">
                <FaUsers className="icon" />
                <div>
                  <h2>100</h2>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="stat-card">
                <FaBuilding className="icon" />
                <div>
                  <h2>15</h2>
                  <button
                    className="companys"
                    onClick={() => navigate(`/CompanyPage`)}
                  >
                    Total Companys
                  </button>
                </div>
              </div>

              <div className="stat-card">
                <FaBriefcase className="icon" />
                <div>
                  <h2>45</h2>
                  <p>Total Job Listings</p>
                </div>
              </div>  

              <div className="stat-card">
                <FaClipboardList className="icon" />
                <div>
                  <h2>7</h2>
                  <p>Pending Job Posts</p>
                </div>
              </div>
            </div>

            <div className="status-row">
              <div className="status">
                <FaChartBar /> 7 Pending Job Posts
              </div>

              <div className="status">
                <FaExclamationTriangle /> 3 Reports
              </div>

              <div className="status">
                <FaCommentDots /> 5 Feedback Messages
              </div>
            </div>

            <div className="management">
              <h2>Management</h2>

              <div className="manage-grid">
                <div className="manage-card1">
                  <FaUsers className="micon" />
                  <h3>Manage Users</h3>
                  <p>View, edit, or remove platform users.</p>
                  <button onClick={() => navigate(`/Users`)}>
                    Manage Users
                  </button>
                </div>

                <div className="manage-card1">
                  <FaBuilding className="micon" />
                  <h3>Manage Employers</h3>
                  <p>Manage and verify employer accounts.</p>
                  <button onClick={() => navigate(`/EmployerUser`)}>
                    Manage Employers
                  </button>
                </div>

                <div className="manage-card1">
                  <FaBriefcase className="micon" />
                  <h3>Manage Job Listings</h3>
                  <p>Approve or remove job listings from the platform.</p>
                <button onClick={() => navigate(`/ManageJobListing`)}>
                    Manage Job Listings
                  </button>
                </div>

                <div className="manage-card1">
                  <FaExclamationTriangle className="micon" />
                  <h3>Reports & Feedback</h3>
                  <p>Review user reports and feedback messages.</p>
                  <button>View Reports</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  
  
  );
}