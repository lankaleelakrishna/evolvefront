import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import "./CompanyProfile.css";
import axios from "axios";

const CompanyProfile = () => {
    const [profile, setProfile] = useState({
        companyName: "",
        industry: "",
        location: "",
        website: "",
        email: "",
        phone: "",
        aboutCompany: "",
        logo: "",
    });

    const [errors, setErrors] = useState({});

    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/company-profile/user/${userId}`
                );

                if (res.data) {
                    setProfile(res.data);
                } else {
                    setProfile({
                        companyName: "",
                        industry: "",
                        location: "",
                        website: "",
                        email: "",
                        phone: "",
                        aboutCompany: "",
                        logo: "",
                    });
                }
            } catch (error) {
                console.error("Error fetching company profile:", error);
            }
        };

        if (userId) fetchProfile();
    }, [userId]);

    const validateForm = () => {
        const newErrors = {};

        if (!profile.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        } else if (!/^[A-Za-z\s&.-]+$/.test(profile.companyName)) {
            newErrors.companyName = "Company name should contain only letters";
        } else if (profile.companyName.trim().length < 2) {
            newErrors.companyName = "Company name must be at least 2 characters";
        }

        if (!profile.industry.trim()) {
            newErrors.industry = "Industry is required";
        } else if (!/^[A-Za-z\s&.-]+$/.test(profile.industry)) {
            newErrors.industry = "Industry should contain only letters";
        }

        if (!profile.location.trim()) {
            newErrors.location = "Location is required";
        } else if (!/^[A-Za-z\s,.-]+$/.test(profile.location)) {
            newErrors.location = "Location should contain only letters";
        }

        if (!profile.website.trim()) {
            newErrors.website = "Website is required";
        } else if (
            !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(
                profile.website
            )
        ) {
            newErrors.website = "Enter a valid website URL";
        }

        if (!profile.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!profile.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[6-9][0-9]{9}$/.test(profile.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!profile.aboutCompany.trim()) {
            newErrors.aboutCompany = "About company is required";
        } else if (profile.aboutCompany.trim().length < 20) {
            newErrors.aboutCompany =
                "About company must be at least 20 characters";
        } else if (profile.aboutCompany.trim().length > 500) {
            newErrors.aboutCompany =
                "About company must not exceed 500 characters";
        }

        if (profile.logoFile) {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ];

            if (!allowedTypes.includes(profile.logoFile.type)) {
                newErrors.logo = "Only JPG, JPEG, PNG, or WEBP images are allowed";
            } else if (profile.logoFile.size > 2 * 1024 * 1024) {
                newErrors.logo = "Logo size must be less than 2MB";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                logo: "Only JPG, JPEG, PNG, or WEBP images are allowed",
            }));
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                logo: "Logo size must be less than 2MB",
            }));
            return;
        }

        setErrors((prev) => ({
            ...prev,
            logo: "",
        }));

        setProfile((prev) => ({
            ...prev,
            logoFile: file,
            logoPreview: URL.createObjectURL(file),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const onlyNumbers = value.replace(/\D/g, "");

            if (onlyNumbers.length <= 10) {
                setProfile((prev) => ({
                    ...prev,
                    [name]: onlyNumbers,
                }));
            }

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

            return;
        }

        if (name === "companyName") {
            const onlyCompanyName = value.replace(/[^A-Za-z\s&.-]/g, "");

            setProfile((prev) => ({
                ...prev,
                [name]: onlyCompanyName,
            }));

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

            return;
        }

        if (name === "industry") {
            const onlyIndustry = value.replace(/[^A-Za-z\s&.-]/g, "");

            setProfile((prev) => ({
                ...prev,
                [name]: onlyIndustry,
            }));

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

            return;
        }

        if (name === "location") {
            const onlyLocation = value.replace(/[^A-Za-z\s,.-]/g, "");

            setProfile((prev) => ({
                ...prev,
                [name]: onlyLocation,
            }));

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

            return;
        }

        if (name === "aboutCompany") {
            if (value.length <= 500) {
                setProfile((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

            return;
        }

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const formData = new FormData();

            formData.append("companyName", profile.companyName);
            formData.append("industry", profile.industry);
            formData.append("location", profile.location);
            formData.append("website", profile.website);
            formData.append("email", profile.email);
            formData.append("phone", profile.phone);
            formData.append("aboutCompany", profile.aboutCompany);
            formData.append("userId", userId);

            if (profile.logoFile) {
                formData.append("logo", profile.logoFile);
            }

            if (profile.id) {
                await axios.put(
                    `http://localhost:8080/api/company-profile/${profile.id}`,
                    formData
                );
            } else {
                await axios.post(
                    "http://localhost:8080/api/company-profile",
                    formData
                );
            }

            alert("Company profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Something went wrong while saving company profile.");
        }
    };

    return (
        <div className="employeeDashboardSectionCard">
            <div className="employeeDashboardSectionHeader">
                <h2>Company Profile Creation</h2>
            </div>

            <form className="employeeDashboardFormGrid" onSubmit={handleSave}>
                <div className="employeeDashboardFormGroup">
                    <label>Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={profile.companyName || ""}
                        onChange={handleChange}
                    />
                    {errors.companyName && (
                        <small className="errorText">{errors.companyName}</small>
                    )}
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Industry</label>
                    <input
                        type="text"
                        name="industry"
                        value={profile.industry || ""}
                        onChange={handleChange}
                    />
                    {errors.industry && (
                        <small className="errorText">{errors.industry}</small>
                    )}
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={profile.location || ""}
                        onChange={handleChange}
                    />
                    {errors.location && (
                        <small className="errorText">{errors.location}</small>
                    )}
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Website</label>
                    <input
                        type="text"
                        name="website"
                        value={profile.website || ""}
                        onChange={handleChange}
                        placeholder="https://example.com"
                    />
                    {errors.website && (
                        <small className="errorText">{errors.website}</small>
                    )}
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email || ""}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <small className="errorText">{errors.email}</small>
                    )}
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={profile.phone || ""}
                        onChange={handleChange}
                        maxLength="10"
                        placeholder="Enter 10 digit number"
                    />
                    {errors.phone && (
                        <small className="errorText">{errors.phone}</small>
                    )}
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Company Logo</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e)}
                    />

                    {errors.logo && (
                        <small className="errorText">{errors.logo}</small>
                    )}

                    {profile.logoPreview && (
                        <img
                            src={profile.logoPreview}
                            alt="logo"
                            style={{
                                width: "80px",
                                marginTop: "10px",
                                borderRadius: "6px",
                            }}
                        />
                    )}
                </div>

                <div className="employeeDashboardFormGroup fullWidth">
                    <label>About Company</label>
                    <textarea
                        name="aboutCompany"
                        rows="5"
                        value={profile.aboutCompany || ""}
                        onChange={handleChange}
                        maxLength="500"
                    />
                    {errors.aboutCompany && (
                        <small className="errorText">{errors.aboutCompany}</small>
                    )}
                </div>

                <div className="employeeDashboardButtonRow fullWidth">
                    <button type="submit" className="saveBtn">
                        <FaSave /> Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyProfile;