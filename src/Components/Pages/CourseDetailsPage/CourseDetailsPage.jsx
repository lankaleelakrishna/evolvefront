import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CourseDetailsPage.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import { toast } from "react-toastify";

const CourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [applications, setApplications] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const applyFormRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        qualification: "",
        experience: "",
        message: "",
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
    };

    const checkCandidateAccess = () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role")?.toLowerCase().trim();

        if (!token) {
            toast.warning("Please login as candidate to apply for courses.");
            navigate("/login/candidate");
            return false;
        }

        if (role !== "candidate") {
            toast.error("Only candidates can apply for courses.");
            return false;
        }

        return true;
    };

    useEffect(() => {
        fetchCourseDetails();
        fetchApplications();
    }, [id]);

    const formatPrice = (price) => {
        if (price === null || price === undefined || price === "") return "₹0";
        return `₹${Number(price).toLocaleString("en-IN")}`;
    };

    const getCourseImage = (courseData) => {
        return (
            courseData?.imageUrl ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
        );
    };

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8080/api/courses/${id}`);
            setCourse(res.data);
        } catch (err) {
            console.error("Course details error:", err);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                const savedApplications =
                    JSON.parse(localStorage.getItem("courseApplications")) || [];
                setApplications(savedApplications);
                return;
            }

            const res = await axios.get(
                "http://localhost:8080/api/courseapp/all",
                getAuthHeaders()
            );

            setApplications(res.data || []);
        } catch (err) {
            console.error("Course applications fetch error:", err);

            const savedApplications =
                JSON.parse(localStorage.getItem("courseApplications")) || [];
            setApplications(savedApplications);
        }
    };

    const alreadyApplied = course
        ? applications.some((item) => Number(item.courseId) === Number(course.id))
        : false;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleApplyClick = () => {
        const hasAccess = checkCandidateAccess();

        if (!hasAccess) {
            return;
        }

        setShowForm(true);

        setTimeout(() => {
            applyFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    const handleApplySubmit = async (e) => {
        e.preventDefault();

        const hasAccess = checkCandidateAccess();

        if (!hasAccess) {
            return;
        }

        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phone ||
            !formData.qualification
        ) {
            toast.warning("Please fill all required fields.");
            return;
        }

        if (alreadyApplied) {
            toast.info("You already applied for this course.");
            return;
        }

        const newApplication = {
            courseId: course.id,
            courseName: course.title,
            courseTitle: course.title,
            courseCategory: course.category,
            coursePrice: course.price,
            installment1Amount: course.installment1Amount,
            installment2Amount: course.installment2Amount,
            appliedDate: new Date().toLocaleDateString(),
            status: "Applied",
            paymentStatus: "PENDING",
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phone,
            qualification: formData.qualification,
            experience: formData.experience,
            message: formData.message,
        };

        setSubmitLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:8080/api/courseapp/add",
                newApplication,
                getAuthHeaders()
            );

            const updatedApplications = [...applications, res.data || newApplication];

            setApplications(updatedApplications);
            localStorage.setItem(
                "courseApplications",
                JSON.stringify(updatedApplications)
            );

            setSuccessMessage("Course application submitted successfully! Redirecting to payment...");
            setShowForm(false);

            setTimeout(() => {
                navigate(`/course-payment/${course.id}`);
            }, 1200);
        } catch (err) {
            console.error("Course apply API error:", err);

            const localApplication = {
                ...newApplication,
                id: Date.now(),
            };

            const updatedApplications = [...applications, localApplication];

            setApplications(updatedApplications);
            localStorage.setItem(
                "courseApplications",
                JSON.stringify(updatedApplications)
            );

            setSuccessMessage("Course application submitted successfully! Redirecting to payment...");
            setShowForm(false);

            setTimeout(() => {
                navigate(`/course-payment/${course.id}`);
            }, 1200);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="course-details-not-found">
                    <h2>Loading course...</h2>
                </div>
                <Footer />
            </>
        );
    }

    if (!course) {
        return (
            <>
                <NavBar />
                <div className="course-details-not-found">
                    <h2>Course Not Found</h2>
                    <button onClick={() => navigate("/course-page")}>
                        Back to Courses
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar />

            <div className="course-details-page">
                <section
                    className="course-details-hero"
                    style={{ backgroundImage: `url(${getCourseImage(course)})` }}
                >
                    <div className="course-details-overlay">
                        <button
                            className="back-btn"
                            onClick={() => navigate("/course-page")}
                        >
                            ← Back to Courses
                        </button>

                        <div className="course-details-hero-content">
                            <span>{course.category || "Evolve Course"}</span>
                            <h1>{course.title}</h1>
                            <p>{course.description}</p>

                            <div className="course-details-actions">
                                <button
                                    className={alreadyApplied ? "applied-btn" : ""}
                                    disabled={alreadyApplied}
                                    onClick={handleApplyClick}
                                >
                                    {alreadyApplied ? "Already Applied" : "Apply Now"}
                                </button>

                                <button className="outline-btn">
                                    Download Brochure
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="course-details-container">
                    <div className="course-details-main">
                        <div className="details-card">
                            <h2>Course Overview</h2>
                            <p>{course.description}</p>
                        </div>

                        <div className="details-card">
                            <h2>Course Mode & Payment</h2>

                            <div className="course-payment-grid">
                                <div>
                                    <h4>Mode</h4>
                                    <p>{course.courseMode || "Online / Offline"}</p>
                                </div>

                                <div>
                                    <h4>Total Fee</h4>
                                    <p>{formatPrice(course.price)}</p>
                                </div>

                                <div>
                                    <h4>1st Installment</h4>
                                    <p>{formatPrice(course.installment1Amount)}</p>
                                </div>

                                <div>
                                    <h4>2nd Installment</h4>
                                    <p>{formatPrice(course.installment2Amount)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="details-card">
                            <h2>Course Benefits</h2>
                            <ul>
                                <li>Online and offline learning support</li>
                                <li>Paid training offered by Evolve team</li>
                                <li>Two installment payment option</li>
                                <li>Real-time projects and assignments</li>
                                <li>Certificate from Evolve after course completion</li>
                                <li>Career guidance and job readiness support</li>
                            </ul>
                        </div>

                        {successMessage && (
                            <div className="success-box">{successMessage}</div>
                        )}

                        {showForm && !alreadyApplied && (
                            <div className="apply-form-card" ref={applyFormRef}>
                                <h2>Apply for {course.title}</h2>

                                <form onSubmit={handleApplySubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter phone number"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Qualification *</label>
                                            <input
                                                type="text"
                                                name="qualification"
                                                value={formData.qualification}
                                                onChange={handleChange}
                                                placeholder="B.Tech / Degree / MBA"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Experience</label>
                                        <select
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Experience</option>
                                            <option value="Fresher">Fresher</option>
                                            <option value="0-1 Year">0-1 Year</option>
                                            <option value="1-3 Years">1-3 Years</option>
                                            <option value="3+ Years">3+ Years</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Why do you want to join this course?"
                                        ></textarea>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" disabled={submitLoading}>
                                            {submitLoading ? "Submitting..." : "Submit Application"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <aside className="course-details-sidebar">
                        <img src={getCourseImage(course)} alt={course.title} />

                        <div className="sidebar-info">
                            <h3>{formatPrice(course.price)}</h3>

                            <p>
                                <strong>Duration</strong>
                                <span>{course.duration || "Flexible"}</span>
                            </p>

                            <p>
                                <strong>Mode</strong>
                                <span>{course.courseMode || "BOTH"}</span>
                            </p>

                            <p>
                                <strong>1st Installment</strong>
                                <span>{formatPrice(course.installment1Amount)}</span>
                            </p>

                            <p>
                                <strong>2nd Installment</strong>
                                <span>{formatPrice(course.installment2Amount)}</span>
                            </p>

                            <p>
                                <strong>Certificate</strong>
                                <span>Evolve Certificate</span>
                            </p>

                            <button
                                className={alreadyApplied ? "applied-btn" : ""}
                                disabled={alreadyApplied}
                                onClick={handleApplyClick}
                            >
                                {alreadyApplied ? "Already Applied" : "Apply Now"}
                            </button>
                        </div>
                    </aside>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default CourseDetailsPage;