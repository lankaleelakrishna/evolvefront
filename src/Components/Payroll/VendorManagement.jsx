import React, { useEffect, useState } from "react";
import "./VendorManagement.css";
import { toast } from "react-toastify";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [submittedCandidates, setSubmittedCandidates] = useState([]);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);

  const [formData, setFormData] = useState({
    vendorName: "",
    companyName: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
    serviceType: "",
    contactPerson: "",
    status: "ACTIVE",
  });

  const [assignData, setAssignData] = useState({
    jobId: "",
    deadline: "",
    submissionLimit: "",
    priority: "NORMAL",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendors();
    fetchJobs();
  }, []);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchVendors = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/vendors/all", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/aftergrad/all", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAssignChange = (e) => {
    setAssignData({
      ...assignData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/vendors/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Vendor added successfully");

        setFormData({
          vendorName: "",
          companyName: "",
          email: "",
          phone: "",
          gstNumber: "",
          address: "",
          serviceType: "",
          contactPerson: "",
          status: "ACTIVE",
        });

        setShowForm(false);
        fetchVendors();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to add vendor");
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      toast.error("Something went wrong");
    }
  };

  const openAssignModal = (vendor) => {
    setSelectedVendor(vendor);
    setAssignData({
      jobId: "",
      deadline: "",
      submissionLimit: "",
      priority: "NORMAL",
    });
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setSelectedVendor(null);
    setShowAssignModal(false);
  };

  const handleAssignJob = async (e) => {
    e.preventDefault();

    if (!selectedVendor?.id) {
      toast.warning("Please select vendor");
      return;
    }

    if (!assignData.jobId) {
      toast.warning("Please select job");
      return;
    }

    try {
      const params = new URLSearchParams({
        vendorId: selectedVendor.id,
        jobId: assignData.jobId,
        priority: assignData.priority,
      });

      if (assignData.deadline) {
        params.append("deadline", assignData.deadline);
      }

      if (assignData.submissionLimit) {
        params.append("submissionLimit", assignData.submissionLimit);
      }

      const response = await fetch(
        `http://localhost:8080/api/vendor-jobs/assign?${params.toString()}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        toast.success("Job assigned to vendor successfully");
        closeAssignModal();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to assign job");
      }
    } catch (error) {
      console.error("Assign job error:", error);
      toast.error("Something went wrong while assigning job");
    }
  };

  const fetchVendorCandidates = async (vendor) => {
    try {
      setSelectedVendor(vendor);

      const response = await fetch(
        `http://localhost:8080/api/vendor-candidates/vendor/${vendor.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubmittedCandidates(data || []);
        setShowCandidatesModal(true);
      } else {
        toast.error("Failed to fetch submitted candidates");
      }
    } catch (error) {
      console.error("Candidates fetch error:", error);
      toast.error("Something went wrong");
    }
  };

  const updateCandidateStatus = async (candidateId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/vendor-candidates/status/${candidateId}?status=${status}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        toast.success("Candidate status updated successfully");

        if (selectedVendor?.id) {
          fetchVendorCandidates(selectedVendor);
        }
      } else {
        toast.error("Failed to update candidate status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Something went wrong");
    }
  };

  const getCandidateJobTitle = (candidate) => {
    return candidate?.job?.jobTitle || candidate?.job?.title || "Job";
  };

  return (
    <div className="vendor-management-page">
      <div className="vendor-header">
        <div>
          <h2>Vendor Management</h2>
          <p>Manage recruitment vendors and assign job requirements</p>
        </div>

        <button className="add-vendor-btn" onClick={() => setShowForm(true)}>
          + Add Vendor
        </button>
      </div>

      {showForm && (
        <div className="vendor-form-card">
          <div className="vendor-form-header">
            <h3>Add New Vendor</h3>
            <button onClick={() => setShowForm(false)}>×</button>
          </div>

          <form onSubmit={handleAddVendor} className="vendor-form">
            <input
              type="text"
              name="vendorName"
              placeholder="Vendor Name"
              value={formData.vendorName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="gstNumber"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={handleChange}
            />

            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select Service Type</option>
              <option value="IT Recruitment">IT Recruitment</option>
              <option value="Non-IT Recruitment">Non-IT Recruitment</option>
              <option value="Recruitment">Recruitment</option>
              <option value="Payroll">Payroll</option>
              <option value="Training">Training</option>
              <option value="Software">Software</option>
            </select>

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <button type="submit">Save Vendor</button>
          </form>
        </div>
      )}

      <div className="vendor-table-card">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Vendor</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No vendors added yet
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.companyName}</td>
                  <td>{vendor.vendorName}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.phone}</td>
                  <td>{vendor.serviceType}</td>
                  <td>
                    <span className="vendor-status">{vendor.status}</span>
                  </td>
                  <td>
                    <div className="vendor-action-group">
                      <button
                        className="assign-job-btn"
                        onClick={() => openAssignModal(vendor)}
                      >
                        Assign Job
                      </button>

                      <button
                        className="view-candidates-btn"
                        onClick={() => fetchVendorCandidates(vendor)}
                      >
                        View Candidates
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAssignModal && selectedVendor && (
        <div className="vendor-modal-overlay">
          <div className="vendor-assign-modal">
            <div className="vendor-form-header">
              <div>
                <h3>Assign Job To Vendor</h3>
                <p>
                  Vendor: <strong>{selectedVendor.vendorName}</strong>
                </p>
              </div>

              <button onClick={closeAssignModal}>×</button>
            </div>

            <form onSubmit={handleAssignJob} className="vendor-form">
              <select
                name="jobId"
                value={assignData.jobId}
                onChange={handleAssignChange}
                required
              >
                <option value="">Select Job Requirement</option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.jobTitle || job.title} -{" "}
                    {job.compName || job.companyName || "Company"}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="deadline"
                value={assignData.deadline}
                onChange={handleAssignChange}
              />

              <input
                type="number"
                name="submissionLimit"
                placeholder="Submission Limit"
                value={assignData.submissionLimit}
                onChange={handleAssignChange}
              />

              <select
                name="priority"
                value={assignData.priority}
                onChange={handleAssignChange}
              >
                <option value="NORMAL">Normal Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Priority</option>
              </select>

              <button type="submit">Assign Job</button>
            </form>
          </div>
        </div>
      )}

      {showCandidatesModal && selectedVendor && (
        <div className="vendor-modal-overlay">
          <div className="vendor-candidates-modal">
            <div className="vendor-form-header">
              <div>
                <h3>Vendor Submitted Candidates</h3>
                <p>
                  Vendor: <strong>{selectedVendor.vendorName}</strong>
                </p>
              </div>

              <button onClick={() => setShowCandidatesModal(false)}>×</button>
            </div>

            <div className="vendor-candidates-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Job</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>

                <tbody>
                  {submittedCandidates.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No candidates submitted by this vendor
                      </td>
                    </tr>
                  ) : (
                    submittedCandidates.map((candidate) => (
                      <tr key={candidate.id}>
                        <td>{candidate.candidateName}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.phone}</td>
                        <td>{getCandidateJobTitle(candidate)}</td>
                        <td>{candidate.experience || "-"}</td>
                        <td>{candidate.skills || "-"}</td>
                        <td>
                          <span className="vendor-status">
                            {candidate.status || "SUBMITTED"}
                          </span>
                        </td>
                        <td>
                          <select
                            className="candidate-status-select"
                            value={candidate.status || "SUBMITTED"}
                            onChange={(e) =>
                              updateCandidateStatus(candidate.id, e.target.value)
                            }
                          >
                            <option value="SUBMITTED">Submitted</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="INTERVIEW_SCHEDULED">
                              Interview Scheduled
                            </option>
                            <option value="SELECTED">Selected</option>
                            <option value="JOINED">Joined</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;