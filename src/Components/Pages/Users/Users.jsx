import React, { useState } from "react";
import "./Users.css";
import Logo from "../../../assets/Logo2.png";

import img31 from "../../../assets/img125.png";
import img32 from "../../../assets/image123.png";
import img33 from "../../../assets/img213.png";
import img34 from "../../../assets/image124.png";
import img35 from "../../../assets/img214.png";
import img36 from "../../../assets/img.127.png";

import {
    FaBuilding,
    FaBriefcase,
    FaHome,
    FaUser,
    FaExclamationTriangle
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Users() {

    const navigate = useNavigate();

    /* ✅ SIDEBAR STATE */
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /* ✅ USERS DATA */
    const [users, setUsers] = useState([
        { id: 1, name: "Kiran", status: "active", avatar: img36 },
        { id: 2, name: "Mahesh", status: "blocked", avatar: img34 },
        { id: 3, name: "Naila", status: "active", avatar: img33 },
        { id: 4, name: "Jack", status: "active", avatar: img32 },
        { id: 5, name: "Jenny", status: "active", avatar: img35 },
        { id: 6, name: "Vijay", status: "active", avatar: img31 },
    ]);

    /* ✅ TOGGLE USER STATUS */
    const toggleStatus = (id) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: user.status === "active" ? "blocked" : "active" }
                : user
        ));
    };

    return (
        <div className="admin-container">

            <div className="hamburger" onClick={() => setSidebarOpen(true)}>
                ☰
            </div>

     
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className={`sidebar-users ${sidebarOpen ? "open" : ""}`} style={{marginLeft:"-40px",marginTop:"-25px"}}>

                <div className="navbar-logo" onClick={() => navigate("/")}>
                    <img src={Logo} alt="logo" className="logo-img" />
                    <span className="logo-texts">Aftergraduate</span>
                </div>

                <div
                    className="side-item"
                    onClick={() => {
                        navigate("/admin");
                        setSidebarOpen(false);
                    }}
                >
                    <FaHome /> Dashboard
                </div>

                <div className="side-item active">
                    <FaUser /> Manage Users
                </div>

                <div
                    className="side-item"
                    onClick={() => {
                        navigate("/EmployerUser");
                        setSidebarOpen(false);
                    }}
                >
                    <FaBuilding /> Manage Employers
                </div>

                <div
                    className="side-item"
                    onClick={() => {
                        navigate("/ManageJobListing");
                        setSidebarOpen(false);
                    }}
                >
                    <FaBriefcase /> Manage Job Listings
                </div>

                <div className="side-item">
                    <FaExclamationTriangle /> Reports & Feedback
                </div>

            </div>

            {/* ✅ MAIN CONTENT */}
            <div className="manage-users">

                <h2>Manage Users</h2>

                {/* ✅ TABLE WRAPPER (IMPORTANT) */}
                <div className="table-wrapper">

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>

                                    <td>
                                        <img src={user.avatar} alt="user" className="av" />
                                    </td>

                                    <td>{user.name}</td>

                                    <td
                                        className={
                                            user.status === "active"
                                                ? "status-active"
                                                : "status-blocked"
                                        }
                                    >
                                        {user.status}
                                    </td>

                                    <td>
                                        <button
                                            className={
                                                user.status === "active"
                                                    ? "block-btn"
                                                    : "unblock-btn"
                                            }
                                            onClick={() => toggleStatus(user.id)}
                                        >
                                            {user.status === "active" ? "Block" : "Unblock"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

        </div>
    );
}

export default Users;