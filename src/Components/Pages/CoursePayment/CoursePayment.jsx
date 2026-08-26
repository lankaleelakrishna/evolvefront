import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";
import { API_BASE_URL } from "../../../config/api";
import "./CoursePayment.css";

const CoursePayment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [application, setApplication] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("Razorpay");
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
    };

    useEffect(() => {
        fetchPaymentDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const formatPrice = (price) => {
        if (price === null || price === undefined || price === "") return "₹0";
        return `₹${Number(price).toLocaleString("en-IN")}`;
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const fetchPaymentDetails = async () => {
        try {
            setLoading(true);

            const coursesRes = await axios.get(`${API_BASE_URL}/api/courses/all`);

            const selectedCourse = (coursesRes.data || []).find(
                (item) => Number(item.id) === Number(courseId)
            );

            const appRes = await axios.get(
                `${API_BASE_URL}/api/courseapp/all`,
                getAuthHeaders()
            );

            const selectedApplication = (appRes.data || []).find(
                (item) => Number(item.courseId) === Number(courseId)
            );

            setCourse(selectedCourse || null);
            setApplication(selectedApplication || null);

            if (selectedCourse?.installment1Amount) {
                setSelectedAmount(selectedCourse.installment1Amount);
            } else {
                setSelectedAmount(selectedCourse?.price || 0);
            }
        } catch (error) {
            console.error("Payment details error:", error);

            const savedApplications =
                JSON.parse(localStorage.getItem("courseApplications")) || [];

            const localApplication = savedApplications.find(
                (item) => Number(item.courseId) === Number(courseId)
            );

            setApplication(localApplication || null);

            if (localApplication) {
                setCourse({
                    id: localApplication.courseId,
                    title: localApplication.courseName,
                    category: localApplication.courseCategory,
                    price: localApplication.coursePrice,
                    installment1Amount: localApplication.installment1Amount,
                    installment2Amount: localApplication.installment2Amount,
                    description: "Complete your payment to confirm enrollment.",
                    courseMode: "BOTH",
                    duration: "Flexible",
                });

                setSelectedAmount(
                    localApplication.installment1Amount ||
                    localApplication.coursePrice ||
                    0
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRazorpayPayment = async () => {
        if (!application?.id) {
            alert("Application not found. Please apply again.");
            return;
        }

        if (!selectedAmount || Number(selectedAmount) <= 0) {
            alert("Please select valid payment amount.");
            return;
        }

        setPaying(true);

        try {
            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                alert("Razorpay SDK failed to load. Check internet connection.");
                setPaying(false);
                return;
            }

            const orderRes = await axios.post(
                `${API_BASE_URL}/api/payments/create-order`,
                {
                    applicationId: application.id,
                    amount: Number(selectedAmount),
                },
                getAuthHeaders()
            );

            const orderData = orderRes.data;

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "EVOLVE",
                description: `${course.title || course.courseName} Course Payment`,
                order_id: orderData.orderId,

                handler: async function (response) {
                    try {
                        await axios.post(
                            `${API_BASE_URL}/api/payments/verify`,
                            {
                                applicationId: application.id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            },
                            getAuthHeaders()
                        );

                        const saved =
                            JSON.parse(localStorage.getItem("courseApplications")) || [];

                        const updated = saved.map((item) =>
                            Number(item.courseId) === Number(courseId)
                                ? {
                                      ...item,
                                      paymentStatus: "PAID",
                                      status: "Enrolled",
                                  }
                                : item
                        );

                        localStorage.setItem(
                            "courseApplications",
                            JSON.stringify(updated)
                        );

                        alert("Payment successful! You are enrolled.");
                        navigate("/courses");
                    } catch (verifyError) {
                        console.error("Payment verification error:", verifyError);
                        alert("Payment done, but verification failed. Please contact admin.");
                    } finally {
                        setPaying(false);
                    }
                },

                prefill: {
                    name: application.fullName || "",
                    email: application.email || "",
                    contact: application.phoneNumber || "",
                },

                notes: {
                    courseId: String(courseId),
                    applicationId: String(application.id),
                    courseName: course.title || course.courseName || "Course",
                },

                theme: {
                    color: "#2563EB",
                },

                modal: {
                    ondismiss: function () {
                        setPaying(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                alert(response.error.description || "Payment failed. Please try again.");
                setPaying(false);
            });

            razorpay.open();
        } catch (error) {
            console.error("Razorpay payment error:", error);
            alert("Unable to start payment. Please check backend and Razorpay keys.");
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="course-payment-page">
                    <div className="payment-loading-card">
                        <h2>Loading payment details...</h2>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!course) {
        return (
            <>
                <NavBar />
                <div className="course-payment-page">
                    <div className="payment-loading-card">
                        <h2>Course not found</h2>
                        <button onClick={() => navigate("/courses")}>
                            Back to Courses
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar />

            <div className="course-payment-page">
                <div className="course-payment-container">
                    <div className="payment-left-card">
                        <span className="payment-badge">Course Payment</span>

                        <h1>{course.title || course.courseName}</h1>

                        <p>
                            {course.description ||
                                "Complete your payment to confirm enrollment."}
                        </p>

                        <div className="payment-course-info">
                            <div>
                                <span>Category</span>
                                <strong>
                                    {course.category || course.courseCategory || "Course"}
                                </strong>
                            </div>

                            <div>
                                <span>Mode</span>
                                <strong>{course.courseMode || "BOTH"}</strong>
                            </div>

                            <div>
                                <span>Duration</span>
                                <strong>{course.duration || "Flexible"}</strong>
                            </div>

                            <div>
                                <span>Total Fee</span>
                                <strong>
                                    {formatPrice(course.price || course.coursePrice)}
                                </strong>
                            </div>
                        </div>

                        <div className="payment-status-box">
                            <h3>Application Status</h3>

                            <p>
                                Status: <strong>{application?.status || "Applied"}</strong>
                            </p>

                            <p>
                                Payment:{" "}
                                <strong>{application?.paymentStatus || "PENDING"}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="payment-right-card">
                        <h2>Choose Payment</h2>

                        <div className="installment-options">
                            <label
                                className={
                                    Number(selectedAmount) === Number(course.installment1Amount)
                                        ? "active"
                                        : ""
                                }
                            >
                                <input
                                    type="radio"
                                    name="amount"
                                    value={course.installment1Amount || ""}
                                    checked={
                                        Number(selectedAmount) ===
                                        Number(course.installment1Amount)
                                    }
                                    onChange={(e) => setSelectedAmount(e.target.value)}
                                />

                                <div>
                                    <span>1st Installment</span>
                                    <strong>{formatPrice(course.installment1Amount)}</strong>
                                </div>
                            </label>

                            <label
                                className={
                                    Number(selectedAmount) === Number(course.installment2Amount)
                                        ? "active"
                                        : ""
                                }
                            >
                                <input
                                    type="radio"
                                    name="amount"
                                    value={course.installment2Amount || ""}
                                    checked={
                                        Number(selectedAmount) ===
                                        Number(course.installment2Amount)
                                    }
                                    onChange={(e) => setSelectedAmount(e.target.value)}
                                />

                                <div>
                                    <span>2nd Installment</span>
                                    <strong>{formatPrice(course.installment2Amount)}</strong>
                                </div>
                            </label>

                            <label
                                className={
                                    Number(selectedAmount) ===
                                    Number(course.price || course.coursePrice)
                                        ? "active"
                                        : ""
                                }
                            >
                                <input
                                    type="radio"
                                    name="amount"
                                    value={course.price || course.coursePrice || ""}
                                    checked={
                                        Number(selectedAmount) ===
                                        Number(course.price || course.coursePrice)
                                    }
                                    onChange={(e) => setSelectedAmount(e.target.value)}
                                />

                                <div>
                                    <span>Full Payment</span>
                                    <strong>
                                        {formatPrice(course.price || course.coursePrice)}
                                    </strong>
                                </div>
                            </label>
                        </div>

                        <div className="payment-methods">
                            <h3>Payment Method</h3>

                            <select
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                            >
                                <option value="Razorpay">Razorpay UPI / Card / Net Banking</option>
                            </select>
                        </div>

                        <div className="payment-summary">
                            <div>
                                <span>Selected Amount</span>
                                <strong>{formatPrice(selectedAmount)}</strong>
                            </div>

                            <div>
                                <span>Payment Mode</span>
                                <strong>{paymentMode}</strong>
                            </div>
                        </div>

                        <button
                            className="pay-now-btn"
                            onClick={handleRazorpayPayment}
                            disabled={paying || application?.paymentStatus === "PAID"}
                        >
                            {application?.paymentStatus === "PAID"
                                ? "Already Paid"
                                : paying
                                ? "Opening Razorpay..."
                                : `Pay Now ${formatPrice(selectedAmount)}`}
                        </button>

                        <button
                            className="back-course-btn"
                            onClick={() => navigate("/course-page")}
                        >
                            Back to Courses
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default CoursePayment;