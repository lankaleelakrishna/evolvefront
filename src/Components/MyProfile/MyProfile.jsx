import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./MyProfile.css";
import NavBar from "../HomePage/NavBar/NavBar";
import Footer from "../Footer/Footer";

const MyProfile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: "Pradeep Varma",
        email: "pradeep@email.com",
        phone: "+91 9876543210",
        location: "Bangalore, India",
        role: "Software Developer",
        skills: "JavaScript, React, NodeJS",
        bio: "Passionate developer looking for full-stack opportunities.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <>
            <NavBar />

            <div className="myprofile-page">
                <div className="myprofile-layout">
                    <aside className="myapp-sidebar">
                        <div className="myapp-sidebar-header">
                            <div className="myapp-sidebar-avatar">P</div>
                            <h3>Pradeep</h3>
                            <p>Candidate Panel</p>
                        </div>

                        <div className="myapp-sidebar-menu">
                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/student-dashboard")}
                            >
                                <span>🏠</span>
                                <span>Dashboard</span>
                            </div>

                            <div className="myapp-sidebar-item active">
                                <span>👤</span>
                                <span>My Profile</span>
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/MyApplication")}
                            >
                                <span>📄</span>
                                <span>My Applications</span>
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/saved-jobs")}
                            >
                                <span>💾</span>
                                <span>Saved Jobs</span>
                            </div>

                            <div
                                className="myapp-sidebar-item"
                                onClick={() => navigate("/jobs")}
                            >
                                <span>🔎</span>
                                <span>Browse Jobs</span>
                            </div>
                        </div>
                    </aside>

                    <div className="myprofile-profile-container">
                        <div className="myprofile-profile-card">
                            <div className="myprofile-profile-header">
                                <div className="myprofile-profile-user">
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        className="myprofile-avatar-image"
                                    />
                                    <div className="myprofile-user-info">
                                        <h2>{profile.name}</h2>
                                        <p>{profile.role}</p>
                                        <span>{profile.location}</span>
                                    </div>
                                </div>

                                <button
                                    className="myprofile-edit-btn"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </button>
                            </div>

                            <div className="myprofile-profile-details">
                                <div className="myprofile-field">
                                    <label>FULL NAME</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p>{profile.name}</p>
                                    )}
                                </div>

                                <div className="myprofile-field">
                                    <label>EMAIL</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p>{profile.email}</p>
                                    )}
                                </div>

                                <div className="myprofile-field">
                                    <label>PHONE</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p>{profile.phone}</p>
                                    )}
                                </div>

                                <div className="myprofile-field">
                                    <label>LOCATION</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={profile.location}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p>{profile.location}</p>
                                    )}
                                </div>

                                <div className="myprofile-field">
                                    <label>ROLE</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="role"
                                            value={profile.role}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p>{profile.role}</p>
                                    )}
                                </div>

                                <div className="myprofile-field">
                                    <label>SKILLS</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="skills"
                                            value={profile.skills}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p>{profile.skills}</p>
                                    )}
                                </div>

                                <div className="myprofile-field myprofile-field-full">
                                    <label>BIO</label>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={profile.bio}
                                            onChange={handleChange}
                                            rows="4"
                                        />
                                    ) : (
                                        <p>{profile.bio}</p>
                                    )}
                                </div>

                                <div className="myprofile-field myprofile-field-full">
                                    <label>PROFILE IMAGE URL</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="image"
                                            value={profile.image}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="myprofile-image-link">{profile.image}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <button className="myprofile-save-btn" onClick={handleSave}>
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="myprofile-right-sidebar">
                        <div className="myprofile-overview-card">
                            <h3>Profile Completion</h3>
                            <div className="myprofile-progress-bar">
                                <div className="myprofile-progress-fill"></div>
                            </div>
                            <p>80% Completed</p>
                        </div>

                        <div className="myprofile-overview-card">
                            <h3>Quick Tips</h3>
                            <ul className="myprofile-tips-list">
                                <li>Update your latest skills</li>
                                <li>Add projects to boost your profile</li>
                                <li>Keep your contact details active</li>
                                <li>Complete bio for better visibility</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </>
    );
};

export default MyProfile;