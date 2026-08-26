import React, { useState, useEffect } from "react";
import { FaFilePdf, FaImage, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../../config/api";
import "./CandidateResume.css";
import axios from "axios";

const CandidateResume = ({ resumeFile, onResumeUpload }) => {
    const [photoFile, setPhotoFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) setPhotoFile(file);
    };

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("token");

        if (!email || !token) return;

        fetch(`${API_BASE_URL}/api/profile/${email}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.resume) {
                    let base64String;

                    if (Array.isArray(data.resume)) {
                        base64String = btoa(
                            new Uint8Array(data.resume).reduce(
                                (acc, byte) => acc + String.fromCharCode(byte),
                                ""
                            )
                        );
                    } else {
                        base64String = data.resume;
                    }

                    setResumeUrl(`data:application/pdf;base64,${base64String}`);
                }

                if (data.photo) {
                    setPhotoUrl(`data:image/jpeg;base64,${data.photo}`);
                }
            })
            .catch(() => {
                toast.error("Failed to load profile");
            });
    }, []);

    const handleSave = async () => {
        try {
            const email = localStorage.getItem("userEmail");
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("email", email);

            if (resumeFile) {
                formData.append("resume", resumeFile);
            }

            if (photoFile) {
                formData.append("photo", photoFile);
            }

            await axios.post(
                `${API_BASE_URL}/api/profile/upload`,
                formData,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            toast.success("Uploaded successfully", {
                autoClose: false,
                closeOnClick: true,
                hideProgressBar: true
            });
        } catch (error) {
            toast.error("Error uploading files", {
                autoClose: false,
                closeOnClick: true,
                hideProgressBar: true
            });
        }
    };

    return (
        <div className="candidateDashboardSectionCard">
            <div className="candidateDashboardSectionHeader">
                <h2>Upload Resume & Photo</h2>
            </div>

            <div className="candidateDashboardResumeBoxRow">
                <div className="candidateDashboardResumeBox">
                    <label className="candidateDashboardUploadLabel">
                        <FaFilePdf />
                        <span>Choose Resume PDF</span>

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={onResumeUpload}
                            hidden
                        />
                    </label>

                    {resumeFile && (
                        <div className="candidateDashboardResumePreview">
                            <h3>Selected Resume</h3>

                            <p>{resumeFile.name}</p>

                            <span>
                                {(resumeFile.size / 1024).toFixed(2)} KB • PDF
                            </span>
                        </div>
                    )}

                    {resumeUrl && (
                        <div className="candidateDashboardResumePreview">
                            <h3>Saved Resume</h3>

                            <button
                                onClick={() => {
                                    const byteCharacters = atob(
                                        resumeUrl.split(",")[1]
                                    );

                                    const byteNumbers = new Array(
                                        byteCharacters.length
                                    );

                                    for (
                                        let i = 0;
                                        i < byteCharacters.length;
                                        i++
                                    ) {
                                        byteNumbers[i] =
                                            byteCharacters.charCodeAt(i);
                                    }

                                    const byteArray = new Uint8Array(
                                        byteNumbers
                                    );

                                    const blob = new Blob([byteArray], {
                                        type: "application/pdf"
                                    });

                                    const blobUrl =
                                        URL.createObjectURL(blob);

                                    window.open(blobUrl, "_blank");
                                }}
                            >
                                View Resume
                            </button>
                        </div>
                    )}
                </div>

                <div className="candidateDashboardResumeBox">
                    <label className="candidateDashboardUploadLabel">
                        <FaImage />
                        <span>Upload Profile Photo</span>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            hidden
                        />
                    </label>

                    {photoFile && (
                        <div className="candidateDashboardResumePreview">
                            <h3>Selected Photo</h3>

                            <p>{photoFile.name}</p>

                            <img
                                src={URL.createObjectURL(photoFile)}
                                alt="Preview"
                                className="candidateDashboardPhotoPreview"
                            />
                        </div>
                    )}

                    {photoUrl && (
                        <div className="candidateDashboardResumePreview">
                            <h3>Saved Photo</h3>

                            <img
                                src={photoUrl}
                                alt="Profile"
                                className="candidateDashboardPhotoPreview"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="candidateDashboardSaveBtnWrap">
                <button
                    className="candidateDashboardSaveBtn"
                    onClick={handleSave}
                >
                    <FaSave /> Save
                </button>
            </div>
        </div>
    );
};

export default CandidateResume;