import React, { useEffect, useState } from "react";
import { FaSave, FaFilePdf, FaImage } from "react-icons/fa";
import { API_BASE_URL } from "../../../../config/api";
import "./CandidateProfile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CandidateProfile = ({
  candidateProfile,
  onProfileChange,
  onSaveProfile,
  setCandidateProfile,
}) => {
  const userEmail =
    localStorage.getItem("userEmail") || localStorage.getItem("email");

  const [resumeFile, setResumeFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    fetch(`${API_BASE_URL}/api/profile/${userEmail}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        setCandidateProfile((prev) => ({
          ...prev,
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          skills: data.skills || "",
          experienceLevel: data.exp || "",
          yearsOfExperience: data.yearsExp || "",
          salaryExpectation: data.salaryExpectation || "",
          preferredLocation: data.prefLocation || "",
          category: data.jobCategory || "",
          about: data.about || "",
        }));

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
      .catch((err) => console.log("Fetch error:", err));
  }, [userEmail, setCandidateProfile]);

  const moveToSearchJobsTab = () => {
    setTimeout(() => {
      if (onSaveProfile) {
        onSaveProfile();
      }
    }, 1000);
  };

  const handleValidatedProfileChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (
      name === "fullName" ||
      name === "location" ||
      name === "preferredLocation" ||
      name === "category"
    ) {
      updatedValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    if (name === "phone") {
      updatedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    if (name === "yearsOfExperience") {
      updatedValue = value.replace(/[^0-9]/g, "").slice(0, 2);
    }

    if (name === "salaryExpectation") {
      updatedValue = value.replace(/[^0-9]/g, "");
    }

    onProfileChange({
      target: {
        name,
        value: updatedValue,
      },
    });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF resume allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume size should be less than 10MB");
      return;
    }

    setResumeFile(file);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image file allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo size should be less than 2MB");
      return;
    }

    setPhotoFile(file);
  };

  const uploadResumeAndPhoto = async () => {
    if (!resumeFile && !photoFile) return true;

    const email =
      localStorage.getItem("userEmail") || localStorage.getItem("email");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("email", email);

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    await axios.post(`${API_BASE_URL}/api/profile/upload`, formData, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return true;
  };

  const validateForm = () => {
    const namePattern = /^[A-Za-z\s]{3,50}$/;
    const textPattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;

    if (!candidateProfile.fullName?.trim()) {
      toast.error("Full Name is required");
      return false;
    }

    if (!namePattern.test(candidateProfile.fullName.trim())) {
      toast.error("Full Name should contain only letters and minimum 3 characters");
      return false;
    }

    if (!candidateProfile.email?.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!emailPattern.test(candidateProfile.email.trim())) {
      toast.error("Please enter valid email");
      return false;
    }

    if (!candidateProfile.phone?.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!phonePattern.test(candidateProfile.phone)) {
      toast.error("Phone number must be valid 10 digit Indian number");
      return false;
    }

    if (!candidateProfile.location?.trim()) {
      toast.error("Location is required");
      return false;
    }

    if (!textPattern.test(candidateProfile.location.trim())) {
      toast.error("Location should contain only letters");
      return false;
    }

    if (!candidateProfile.skills?.trim()) {
      toast.error("Skills are required");
      return false;
    }

    if (!candidateProfile.experienceLevel) {
      toast.error("Please select experience level");
      return false;
    }

    if (
      candidateProfile.experienceLevel === "experienced" &&
      (!candidateProfile.yearsOfExperience ||
        Number(candidateProfile.yearsOfExperience) <= 0)
    ) {
      toast.error("Enter valid years of experience");
      return false;
    }

    if (
      candidateProfile.yearsOfExperience &&
      Number(candidateProfile.yearsOfExperience) > 50
    ) {
      toast.error("Years of experience cannot be more than 50");
      return false;
    }

    if (
      candidateProfile.salaryExpectation &&
      Number(candidateProfile.salaryExpectation) < 0
    ) {
      toast.error("Salary expectation cannot be negative");
      return false;
    }

    if (!candidateProfile.preferredLocation?.trim()) {
      toast.error("Preferred location is required");
      return false;
    }

    if (!textPattern.test(candidateProfile.preferredLocation.trim())) {
      toast.error("Preferred location should contain only letters");
      return false;
    }

    if (!candidateProfile.category?.trim()) {
      toast.error("Job category is required");
      return false;
    }

    if (!textPattern.test(candidateProfile.category.trim())) {
      toast.error("Job category should contain only letters");
      return false;
    }

    if (!candidateProfile.about?.trim()) {
      toast.error("About field is required");
      return false;
    }

    if (candidateProfile.about.trim().length < 20) {
      toast.error("About section should be at least 20 characters");
      return false;
    }

    if (candidateProfile.about.length > 500) {
      toast.error("About section cannot exceed 500 characters");
      return false;
    }

    return true;
  };

  const handleViewResume = () => {
    const byteCharacters = atob(resumeUrl.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/pdf",
    });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      fullName: candidateProfile.fullName.trim(),
      email: candidateProfile.email.trim(),
      phone: candidateProfile.phone.trim(),
      location: candidateProfile.location.trim(),
      skills: candidateProfile.skills.trim(),
      exp: candidateProfile.experienceLevel,
      yearsExp: candidateProfile.yearsOfExperience,
      salaryExpectation: candidateProfile.salaryExpectation,
      prefLocation: candidateProfile.preferredLocation.trim(),
      jobCategory: candidateProfile.category.trim(),
      about: candidateProfile.about.trim(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast.error("Failed to save profile ❌");
        return;
      }

      await uploadResumeAndPhoto();

      toast.success("Profile updated successfully ✅");
      moveToSearchJobsTab();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving profile ❌");
    }
  };

  return (
    <>
      <div className="CandidatelayoutSectionCard">
        <div className="CandidatelayoutSectionHeader">
          <h2>Create and Update Profile</h2>
        </div>

        <form className="CandidatelayoutFormGrid" onSubmit={handleSubmit}>
          <div className="CandidatelayoutFormGroup">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={candidateProfile.fullName || ""}
              onChange={handleValidatedProfileChange}
              maxLength={50}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={candidateProfile.email || ""}
              onChange={handleValidatedProfileChange}
              maxLength={100}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={candidateProfile.phone || ""}
              onChange={handleValidatedProfileChange}
              maxLength={10}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={candidateProfile.location || ""}
              onChange={handleValidatedProfileChange}
              maxLength={100}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={candidateProfile.skills || ""}
              onChange={handleValidatedProfileChange}
              maxLength={200}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Experience Level</label>
            <select
              name="experienceLevel"
              value={candidateProfile.experienceLevel || ""}
              onChange={handleValidatedProfileChange}
            >
              <option value="">Select</option>
              <option value="fresher">Fresher</option>
              <option value="experienced">Experienced</option>
            </select>
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Years of Experience</label>
            <input
              type="text"
              name="yearsOfExperience"
              value={candidateProfile.yearsOfExperience || ""}
              onChange={handleValidatedProfileChange}
              maxLength={2}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Salary Expectation per month</label>
            <input
              type="text"
              name="salaryExpectation"
              value={candidateProfile.salaryExpectation || ""}
              onChange={handleValidatedProfileChange}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Preferred Location</label>
            <input
              type="text"
              name="preferredLocation"
              value={candidateProfile.preferredLocation || ""}
              onChange={handleValidatedProfileChange}
              maxLength={100}
            />
          </div>

          <div className="CandidatelayoutFormGroup">
            <label>Job Category</label>
            <input
              type="text"
              name="category"
              value={candidateProfile.category || ""}
              onChange={handleValidatedProfileChange}
              maxLength={100}
            />
          </div>

          <div className="CandidatelayoutFormGroup fullWidth">
            <label>About</label>
            <textarea
              rows="5"
              name="about"
              value={candidateProfile.about || ""}
              onChange={handleValidatedProfileChange}
              maxLength={500}
            />
          </div>

          <div className="candidateProfileUploadSection fullWidth">
            <h3>Resume and Profile Photo</h3>

            <div className="candidateDashboardResumeBoxRow">
              <div className="candidateDashboardResumeBox">
                <label className="candidateDashboardUploadLabel">
                  <FaFilePdf />
                  <span>Choose Resume PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    hidden
                  />
                </label>

                {resumeFile && (
                  <div className="candidateDashboardResumePreview">
                    <h3>Selected Resume</h3>
                    <p>{resumeFile.name}</p>
                    <span>{(resumeFile.size / 1024).toFixed(2)} KB • PDF</span>
                  </div>
                )}

                {resumeUrl && (
                  <div className="candidateDashboardResumePreview">
                    <h3>Saved Resume</h3>
                    <button type="button" onClick={handleViewResume}>
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
          </div>

          <div className="CandidatelayoutButtonRow fullWidth">
            <button type="submit" className="CandidatelayoutSaveBtn">
              <FaSave />
              Save Profile
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </>
  );
};

export default CandidateProfile;