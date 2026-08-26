import React, { useState, useEffect } from "react";
import "./ManageCandidates.css";
import Logo from "../../../../assets/Logo2.png";

import img31 from "../../../../assets/img125.png";
import img32 from "../../../../assets/image123.png";
import img33 from "../../../../assets/img213.png";
import img34 from "../../../../assets/image124.png";
import img35 from "../../../../assets/img214.png";
import img36 from "../../../../assets/img.127.png";

import {
    FaHome,
    FaUser,
    FaBuilding,
    FaBriefcase,
    FaExclamationTriangle,
    FaBars,
    FaTimes
} from "react-icons/fa";
import { PiFilePdf } from "react-icons/pi";

import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageCandidates() {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/candidates");
                const dataWithImages = response.data.map((user, index) => ({
                    ...user,
                    avatar:
                        user.avatar ||
                        [img31, img32, img33, img34, img35, img36][index % 6],
                }));

                setUsers(dataWithImages);

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const toggleStatus = (id) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: user.status === "active" ? "blocked" : "active" }
                : user
        ));
    };

    return (
        <div className="manage-candidates-container">

            <div className="manage-candidates-body">

                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>

                {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

                <div className={`sidebar-candidates ${isOpen ? "open" : ""}`}>

                    <div className="navbar-logo" onClick={() => navigate("/")}>
                        <img src={Logo} alt="logo" className="logo-img" />
                        <span className="logo-texts">Aftergraduate</span>
                    </div>

                    <button onClick={() => { navigate("/Employer"); setIsOpen(false); }}>
                        <FaHome /> Dashboard
                    </button>

                    <button className="active">
                        <FaUser /> Manage Candidates
                    </button>

                    <button onClick={() => { navigate("/CompanyProfile"); setIsOpen(false); }}>
                        <FaBuilding /> Company Profile
                    </button>

                    <button onClick={() => { navigate("/ManageJobs"); setIsOpen(false); }}>
                        <FaBriefcase /> Manage Jobs
                    </button>

                    <button>
                        <FaExclamationTriangle /> Reports
                    </button>
                </div>

                <div className="candidates-content">

                    <h1>Manage Candidates</h1>

                    <table className="candidates-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Resume</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>

                                    <td>
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="avatar"
                                        />
                                    </td>

                                    <td>{user.name}</td>

                                    <td>{user.email}</td>

                                    <td>
                                        <PiFilePdf fontSize={30} />
                                        {user.resume}
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

export default ManageCandidates;