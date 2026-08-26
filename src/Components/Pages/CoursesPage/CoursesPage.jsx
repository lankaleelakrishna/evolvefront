import React, { useEffect, useMemo, useState } from "react";
import "./CoursesPage.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CoursesPage = () => {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [applications, setApplications] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [error, setError] = useState("");

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
        fetchCourses();
        fetchApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatPrice = (price) => {
        if (price === null || price === undefined || price === "") return "₹0";
        return `₹${Number(price).toLocaleString("en-IN")}`;
    };

    const getCourseImage = (course) => {
        return (
            course.imageUrl ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
        );
    };

    const fetchCourses = async () => {
        try {
            setCoursesLoading(true);
            const res = await axios.get(`http://localhost:8080/api/courses/all`);
            setCourses(res.data || []);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Unable to load courses. Please try again.");
        } finally {
            setCoursesLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                const saved = JSON.parse(localStorage.getItem("courseApplications")) || [];
                setApplications(saved);
                return;
            }

            const res = await axios.get(
                `http://localhost:8080/api/courseapp/all`,
                getAuthHeaders()
            );

            setApplications(res.data || []);
        } catch (err) {
            console.error("Error fetching applications:", err);
            const saved = JSON.parse(localStorage.getItem("courseApplications")) || [];
            setApplications(saved);
        }
    };

    const categories = useMemo(() => {
        const uniqueCategories = courses
            .map((course) => course.category)
            .filter(Boolean);

        return ["All", ...new Set(uniqueCategories)];
    }, [courses]);

    const filteredCourses = courses.filter((course) => {
        const title = course.title || "";
        const category = course.category || "";
        const mode = course.courseMode || "";

        const matchesCategory =
            selectedCategory === "All" || category === selectedCategory;

        const matchesSearch =
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mode.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const openApplyModal = (course) => {
        const hasAccess = checkCandidateAccess();

        if (!hasAccess) {
            return;
        }

        setSelectedCourse(course);
        setSuccessMessage("");
        setError("");
    };

    const closeApplyModal = () => {
        setSelectedCourse(null);
        setError("");
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            qualification: "",
            experience: "",
            message: "",
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const alreadyApplied = selectedCourse
        ? applications.some((item) => Number(item.courseId) === Number(selectedCourse.id))
        : false;

    const handleSubmitApplication = async (e) => {
        e.preventDefault();

        const hasAccess = checkCandidateAccess();

        if (!hasAccess) {
            return;
        }

        setError("");

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
           toast.info("You have already applied for this course.");
            return;
        }

        const payload = {
            courseId: selectedCourse.id,
            courseName: selectedCourse.title,
            courseCategory: selectedCourse.category,
            coursePrice: selectedCourse.price,
            installment1Amount: selectedCourse.installment1Amount,
            installment2Amount: selectedCourse.installment2Amount,
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

        setLoading(true);

        try {
            const res = await axios.post(
                `http://localhost:8080/api/courseapp/add`,
                payload,
                getAuthHeaders()
            );

            await fetchApplications();

            const saved = JSON.parse(localStorage.getItem("courseApplications")) || [];

            localStorage.setItem(
                "courseApplications",
                JSON.stringify([...saved, res.data || payload])
            );

            setSuccessMessage("Course application submitted successfully! Redirecting to payment...");

            setTimeout(() => {
                closeApplyModal();
                navigate(`/course-payment/${selectedCourse.id}`);
            }, 1200);
        } catch (err) {
            console.error("Application submit error:", err);

            const saved = JSON.parse(localStorage.getItem("courseApplications")) || [];
            const updated = [...saved, payload];

            localStorage.setItem("courseApplications", JSON.stringify(updated));
            setApplications(updated);

            setSuccessMessage("Course application submitted successfully! Redirecting to payment...");

            setTimeout(() => {
                closeApplyModal();
                navigate(`/course-payment/${selectedCourse.id}`);
            }, 1200);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />

            <div className="courses-page">
                <section className="courses-hero">
                    <div className="courses-hero-content">
                        <span className="courses-badge">Evolve Paid Courses</span>
                        <h1>Online & Offline Career Courses</h1>
                        <p>
                            Join Evolve team offered paid courses, complete your training,
                            and receive your Evolve certificate after successful completion.
                        </p>

                        <div className="courses-search-box">
                            <input
                                type="text"
                                placeholder="Search courses like React, Java, UI UX..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="button">Search</button>
                        </div>
                    </div>
                </section>

                <section className="courses-stats">
                    <div>
                        <h3>{courses.length}+</h3>
                        <p>Evolve Courses</p>
                    </div>
                    <div>
                        <h3>Online</h3>
                        <p>Learning Mode</p>
                    </div>
                    <div>
                        <h3>Offline</h3>
                        <p>Classroom Mode</p>
                    </div>
                    <div>
                        <h3>{applications.length}</h3>
                        <p>Your Applications</p>
                    </div>
                </section>

                <section className="courses-section">
                    <div className="courses-section-header">
                        <div>
                            <h2>Available Courses</h2>
                            <p>Choose a paid course and start your learning journey with Evolve.</p>
                        </div>
                    </div>

                    <div className="course-category-tabs">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={selectedCategory === category ? "active" : ""}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {coursesLoading ? (
                        <div className="no-courses">
                            <h3>Loading courses...</h3>
                            <p>Please wait while we fetch Evolve courses.</p>
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => {
                                    const isApplied = applications.some(
                                        (item) => Number(item.courseId) === Number(course.id)
                                    );

                                    return (
                                        <div className="course-card" key={course.id}>
                                            <div className="course-image">
                                                <img src={getCourseImage(course)} alt={course.title} />
                                                <span>{course.category || "Course"}</span>
                                            </div>

                                            <div className="course-content">
                                                <div className="course-meta">
                                                    <span>{course.courseMode || "BOTH"}</span>
                                                    <span>{course.duration || "Flexible"}</span>
                                                </div>

                                                <h3>{course.title}</h3>
                                                <p>{course.description}</p>

                                                <div className="course-info">
                                                    <span>
                                                        1st Installment: {formatPrice(course.installment1Amount)}
                                                    </span>
                                                    <span>
                                                        2nd: {formatPrice(course.installment2Amount)}
                                                    </span>
                                                </div>

                                                <div className="course-footer">
                                                    <h4>{formatPrice(course.price)}</h4>

                                                    <div className="course-actions">
                                                        <button
                                                            className="details-btn"
                                                            onClick={() =>
                                                                navigate(`/course-details/${course.id}`)
                                                            }
                                                        >
                                                            View Details
                                                        </button>

                                                        <button
                                                            className={isApplied ? "payment-btn" : "apply-btn"}
                                                            onClick={() => {
                                                                if (isApplied) {
                                                                    const hasAccess = checkCandidateAccess();

                                                                    if (!hasAccess) {
                                                                        return;
                                                                    }

                                                                    navigate(`/course-payment/${course.id}`);
                                                                } else {
                                                                    openApplyModal(course);
                                                                }
                                                            }}
                                                        >
                                                            {isApplied ? "Proceed Payment" : "Apply Now"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-courses">
                                    <h3>No courses found</h3>
                                    <p>Try searching another course or category.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {selectedCourse && (
                    <div className="course-modal-overlay">
                        <div className="course-apply-modal">
                            <button className="modal-close" onClick={closeApplyModal}>
                                ×
                            </button>

                            <div className="modal-header">
                                <h2>Apply for Course</h2>
                                <p>{selectedCourse.title}</p>
                            </div>

                            {successMessage && (
                                <div className="success-message">{successMessage}</div>
                            )}

                            {error && <div className="error-message">{error}</div>}

                            {alreadyApplied ? (
                                <div className="already-applied-box">
                                    <h3>You already applied for this course.</h3>
                                    <button onClick={closeApplyModal}>Close</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitApplication} className="course-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
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
                                        <label>Why do you want to join this course?</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Write your message..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="submit-course-btn"
                                        disabled={loading}
                                    >
                                        {loading ? "Submitting..." : "Submit Application"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default CoursesPage;