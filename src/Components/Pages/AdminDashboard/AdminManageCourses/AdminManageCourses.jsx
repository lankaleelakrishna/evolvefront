import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminManageCourses.css";

const AdminManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        courseMode: "BOTH",
        price: "",
        installment1Amount: "",
        installment2Amount: "",
        duration: "",
        imageUrl: "",
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/courses/all");
            setCourses(res.data || []);
        } catch (error) {
            console.error("Fetch courses error:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            title: "",
            category: "",
            description: "",
            courseMode: "BOTH",
            price: "",
            installment1Amount: "",
            installment2Amount: "",
            duration: "",
            imageUrl: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:8080/api/courses/update/${editingId}`,
                    formData
                );
            } else {
                await axios.post(
                    "http://localhost:8080/api/courses/add",
                    formData
                );
            }

            fetchCourses();
            resetForm();
        } catch (error) {
            console.error("Course save error:", error);
        }
    };

    const handleEdit = (course) => {
        setEditingId(course.id);

        setFormData({
            title: course.title || "",
            category: course.category || "",
            description: course.description || "",
            courseMode: course.courseMode || "BOTH",
            price: course.price || "",
            installment1Amount: course.installment1Amount || "",
            installment2Amount: course.installment2Amount || "",
            duration: course.duration || "",
            imageUrl: course.imageUrl || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/courses/delete/${id}`);
            fetchCourses();
        } catch (error) {
            console.error("Delete course error:", error);
        }
    };

    return (
        <div className="adminCoursesPage">
            <div className="adminCourseFormCard">
                <div className="adminCourseHeader">
                    <div>
                        <h2>{editingId ? "Update Course" : "Add New Course"}</h2>
                        <p>Manage Evolve online and offline paid courses.</p>
                    </div>

                    <span>{courses.length} Courses</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="adminCourseGrid">
                        <div className="adminCourseField">
                            <label>Course Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Full Stack Web Development"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="adminCourseField">
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                placeholder="Development"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="adminCourseField">
                            <label>Course Mode</label>
                            <select
                                name="courseMode"
                                value={formData.courseMode}
                                onChange={handleChange}
                            >
                                <option value="ONLINE">ONLINE</option>
                                <option value="OFFLINE">OFFLINE</option>
                                <option value="BOTH">BOTH</option>
                            </select>
                        </div>

                        <div className="adminCourseField">
                            <label>Duration</label>
                            <input
                                type="text"
                                name="duration"
                                placeholder="6 Months"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="adminCourseField">
                            <label>Total Price</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="30000"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="adminCourseField">
                            <label>1st Installment</label>
                            <input
                                type="number"
                                name="installment1Amount"
                                placeholder="15000"
                                value={formData.installment1Amount}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="adminCourseField">
                            <label>2nd Installment</label>
                            <input
                                type="number"
                                name="installment2Amount"
                                placeholder="15000"
                                value={formData.installment2Amount}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="adminCourseField">
                            <label>Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                placeholder="https://images.unsplash.com/..."
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="adminCourseField">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Write course description..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                        ></textarea>
                    </div>

                    <div className="adminCourseActions">
                        <button type="submit">
                            {editingId ? "Update Course" : "Add Course"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="adminCancelBtn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="adminCourseListHeader">
                <h2>Posted Courses</h2>
                <p>All active courses displayed on candidate course page.</p>
            </div>

            <div className="adminCourseCards">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div className="adminCourseCard" key={course.id}>
                            <img
                                src={
                                    course.imageUrl ||
                                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                                }
                                alt={course.title}
                            />

                            <div className="adminCourseContent">
                                <div className="adminCourseTop">
                                    <span>{course.category}</span>
                                    <small>{course.courseMode}</small>
                                </div>

                                <h3>{course.title}</h3>

                                <p>{course.description}</p>

                                <div className="adminCourseMeta">
                                    <strong>₹{Number(course.price || 0).toLocaleString("en-IN")}</strong>
                                    <small>{course.duration}</small>
                                </div>

                                <div className="adminInstallmentBox">
                                    <span>
                                        1st: ₹
                                        {Number(course.installment1Amount || 0).toLocaleString("en-IN")}
                                    </span>
                                    <span>
                                        2nd: ₹
                                        {Number(course.installment2Amount || 0).toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="adminCourseBtns">
                                    <button onClick={() => handleEdit(course)}>
                                        Edit
                                    </button>

                                    <button
                                        className="deleteBtn"
                                        onClick={() => handleDelete(course.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="adminNoCourses">
                        <h3>No courses added yet</h3>
                        <p>Add your first Evolve course using the form above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminManageCourses;