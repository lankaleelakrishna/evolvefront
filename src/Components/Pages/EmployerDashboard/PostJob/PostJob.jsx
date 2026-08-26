import React from "react";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import "./PostJob.css";

const PostJob = ({
    jobForm,
    onChange,
    onSubmit,
    editJobId,
    setEditJobId,
    resetForm,
}) => {
    return (
        <div className="employeeDashboardSectionCard">
            <div className="employeeDashboardSectionHeader">
                <h2>{editJobId ? "Edit Job Opening" : "Post New Job Opening"}</h2>
            </div>

            <form className="employeeDashboardFormGrid" onSubmit={onSubmit}>
                <div className="employeeDashboardFormGroup">
                    <label>Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={jobForm.title}
                        onChange={onChange}
                    />
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={jobForm.department}
                        onChange={onChange}
                    />
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={jobForm.location}
                        onChange={onChange}
                    />
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Salary</label>
                    <input
                        type="text"
                        name="salary"
                        value={jobForm.salary}
                        onChange={onChange}
                    />
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Job Type</label>
                    <select
                        name="type"
                        value={jobForm.type}
                        onChange={onChange}
                    >
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                    </select>
                </div>

                <div className="employeeDashboardFormGroup">
                    <label>Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={jobForm.experience}
                        onChange={onChange}
                    />
                </div>

                <div className="employeeDashboardFormGroup fullWidth">
                    <label>Description</label>
                    <textarea
                        name="description"
                        rows="5"
                        value={jobForm.description}
                        onChange={onChange}
                    />
                </div>

                <div className="employeeDashboardButtonRow fullWidth">
                    <button type="submit" className="saveBtn">
                        <FaPlusCircle /> {editJobId ? "Update Job" : "Post Job"}
                    </button>

                    {editJobId && (
                        <button
                            type="button"
                            className="cancelBtn"
                            onClick={() => {
                                setEditJobId(null);
                                resetForm();
                            }}
                        >
                            <FaTimes /> Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PostJob;