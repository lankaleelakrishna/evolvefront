import React, { useState } from "react";
import "./EmployerUser.css";
import Logo from "../../../../assets/Logo2.png"
import img31 from "../../../../assets/img125.png"
import img32 from "../../../../assets/image123.png"
import img33 from "../../../../assets/img213.png"
import img34 from "../../../../assets/image124.png"
import img35 from "../../../../assets/img214.png"
import img36 from "../../../../assets/img.127.png"

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

function EmployerUser() {

    const [users, setUsers] = useState([
        { id: 1, name: "Kiran", company: "Google", status: "active", avatar: img36 },
        { id: 2, name: "Mahesh", company: "Amazon", status: "blocked", avatar: img34 },
        { id: 3, name: "Naila", company: "Adobe", status: "active",avatar:img33  },
        { id: 4, name: "jack", company: "Facebook", status: "active", avatar:img32  },
        { id: 5, name: "jenny", company: "Microsoft", status: "active", avatar: img35 },
        { id: 6, name: "vijay", company: "Netflix", status: "active", avatar: img31 },
    ]);

    const toggleStatus = (id) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: user.status === "active" ? "blocked" : "active" }
                : user
        ));
    };
  const navigate=useNavigate();
    return (
       

        <div className="admin-container" style={{ width: "100%", padding: "0%", margin: "0%" }}>  
                        
                            <div className="sidebar-emp" style={{ width: "240px" }}>
    

                    <div className="for-logo" style={{ marginTop: "20px" }}>
                        <div className="navbar-logo" onClick={() => (window.location.href = "/")}>
                            <img src={Logo} alt="Job Portal Logo" className="logo-img" />
                            <span className="logo-texts">Aftergraduate</span>

                        </div>
                    </div>
        
                                <div className="side-item" onClick={() => navigate(`/admin`)}>
                                    <FaHome /> Dashboard
                                </div>
        
                    <div className="side-item " onClick={() => navigate(`/users`)} >
                                    <FaUser /> Manage Users
                                </div>
        
                                <div className="side-item active" onClick={() => navigate(`/EmployerUser`)}>
                                    <FaBuilding /> Manage Employers
                                </div>
        
                                <div className="side-item" onClick={() => navigate(`/ManageJobListing`)}>
                                    <FaBriefcase /> Manage Job Listings
                                </div>
        
                                <div className="side-item">
                                    <FaExclamationTriangle /> Reports & Feedback
                                </div>
        
                            </div>
        <div className="employer-user">

                <h2 style={{ marginTop: "40px",fontWeight:"bold",fontSize:"40px"}}>Employer User</h2>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>company</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                  

                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{<img src={user.avatar} alt="" className="av" />}</td>
                            <td> {user.name} </td>

                            <td>{user.company}</td>



                            <td className={user.status === "active" ? "status-active" : "status-blocked"}>
                                {user.status}
                            </td>
                            

      
                            <td>
                                <button
                                    className={user.status === "active" ? "block-btn" : "unblock-btn"}
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

       
    );
}

export default EmployerUser;