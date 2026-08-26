import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaUserPlus,
  FaClipboardList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./VendorDashboard.css";
import NavBar from "../../HomePage/NavBar/NavBar";
import { toast } from "react-toastify";

const VendorDashboard = () => {
  const navigate = useNavigate();

  const vendorName = localStorage.getItem("name") || "Vendor";
  const vendorEmail = localStorage.getItem("userEmail") || "";
  const token = localStorage.getItem("token");

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [vendors, setVendors] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  const [candidateForm, setCandidateForm] = useState({
    candidateName: "",
    email: "",
    phone: "",
    currentCompany: "",
    experience: "",
    skills: "",
    currentCtc: "",
    expectedCtc: "",
    noticePeriod: "",
    resumeUrl: "",
  });

  const currentVendor = vendors[0];

  useEffect(() => {
    fetchVendorDetails();
    fetchAssignedJobs();
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchVendorDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/vendors/all", {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const currentVendorData = data.filter(
          (vendor) => vendor.email === vendorEmail
        );
        setVendors(currentVendorData);
      }
    } catch (error) {
      console.error("Vendor details fetch error:", error);
    }
  };

  const fetchAssignedJobs = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/vendor-jobs/vendor-email?email=${encodeURIComponent(
          vendorEmail
        )}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAssignedJobs(data || []);
      }
    } catch (error) {
      console.error("Assigned jobs fetch error:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/vendor-candidates/vendor-email?email=${encodeURIComponent(
          vendorEmail
        )}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCandidates(data || []);
      }
    } catch (error) {
      console.error("Candidates fetch error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/candidate");
  };

  const getJobTitle = (assignment) => {
    return assignment?.job?.jobTitle || "Job Requirement";
  };

const getCompanyName = (assignment) => {
  return (
    assignment?.job?.company?.companyName ||
    assignment?.job?.compName ||
    assignment?.job?.companyName ||
    assignment?.job?.comp_name ||
    "Company"
  );
};

  const handleCandidateChange = (e) => {
    setCandidateForm({
      ...candidateForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitCandidate = async (e) => {
    e.preventDefault();

    if (!currentVendor?.id) {
      toast.error("Vendor profile not found");
      return;
    }

    if (!selectedJobId) {
      toast.warning("Please select assigned job");
      return;
    }

    if (
      !candidateForm.candidateName ||
      !candidateForm.email ||
      !candidateForm.phone
    ) {
      toast.warning("Please fill candidate name, email and phone");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/vendor-candidates/submit?vendorId=${currentVendor.id}&jobId=${selectedJobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(candidateForm),
        }
      );

      if (response.ok) {
        toast.success("Candidate submitted successfully");

        setCandidateForm({
          candidateName: "",
          email: "",
          phone: "",
          currentCompany: "",
          experience: "",
          skills: "",
          currentCtc: "",
          expectedCtc: "",
          noticePeriod: "",
          resumeUrl: "",
        });

        setSelectedJobId("");
        fetchCandidates();
        setActiveMenu("myCandidates");
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to submit candidate");
      }
    } catch (error) {
      console.error("Candidate submit error:", error);
      toast.error("Something went wrong");
    }
  };

  const shortlistedCount = candidates.filter(
    (item) => item.status === "SHORTLISTED"
  ).length;

  const interviewsCount = candidates.filter(
    (item) => item.status === "INTERVIEW_SCHEDULED"
  ).length;

  const renderDashboard = () => (
    <>
      <div className="vendorProfileBanner">
        <div>
          <h2>{vendorName}</h2>
          <p>{vendorEmail}</p>
          <span>{currentVendor?.serviceType || "Recruitment Vendor"}</span>
        </div>

        <button onClick={() => setActiveMenu("profile")}>View Profile</button>
      </div>

      <div className="vendorStatsGrid">
        <div className="vendorStatCard">
          <div className="statIcon blue">
            <FaBriefcase />
          </div>
          <div>
            <h3>Assigned Jobs</h3>
            <h2>{assignedJobs.length}</h2>
            <p>Jobs assigned by admin</p>
          </div>
        </div>

        <div className="vendorStatCard">
          <div className="statIcon green">
            <FaUserPlus />
          </div>
          <div>
            <h3>Submitted Candidates</h3>
            <h2>{candidates.length}</h2>
            <p>Candidates submitted by you</p>
          </div>
        </div>

        <div className="vendorStatCard">
          <div className="statIcon purple">
            <FaCheckCircle />
          </div>
          <div>
            <h3>Shortlisted</h3>
            <h2>{shortlistedCount}</h2>
            <p>Profiles shortlisted</p>
          </div>
        </div>

        <div className="vendorStatCard">
          <div className="statIcon orange">
            <FaClock />
          </div>
          <div>
            <h3>Interviews</h3>
            <h2>{interviewsCount}</h2>
            <p>Interview scheduled</p>
          </div>
        </div>
      </div>

      <div className="vendorContentGrid">
        <section className="vendorTableCard">
          <div className="vendorSectionHeader">
            <div>
              <h2>Latest Assigned Jobs</h2>
              <p>Job requirements assigned by admin</p>
            </div>
            <button onClick={() => setActiveMenu("assignedJobs")}>
              View All
            </button>
          </div>

          {assignedJobs.length === 0 ? (
            <div className="vendorEmptyBox">
              <h3>No jobs assigned yet</h3>
              <p>Admin-assigned jobs will appear here.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedJobs.slice(0, 5).map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{getJobTitle(assignment)}</td>
                    <td>{getCompanyName(assignment)}</td>
                    <td>{assignment.priority || "NORMAL"}</td>
                    <td>
                      <span className="statusBadge">
                        {assignment.status || "ASSIGNED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="vendorActivityCard">
          <h2>Recent Activity</h2>

          <div className="activityItem">
            <span></span>
            <div>
              <h4>Vendor account active</h4>
              <p>Your vendor profile is ready</p>
            </div>
          </div>

          <div className="activityItem">
            <span></span>
            <div>
              <h4>{assignedJobs.length} assigned jobs</h4>
              <p>Submit candidates for active requirements</p>
            </div>
          </div>

          <div className="activityItem">
            <span></span>
            <div>
              <h4>{candidates.length} candidates submitted</h4>
              <p>Track status from My Candidates</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );

  const renderAssignedJobs = () => (
    <section className="vendorTableCard fullWidth">
      <div className="vendorSectionHeader">
        <div>
          <h2>Assigned Jobs</h2>
          <p>Jobs or hiring requirements assigned to you</p>
        </div>
      </div>

      {assignedJobs.length === 0 ? (
        <div className="vendorEmptyBox">
          <h3>No assigned jobs found</h3>
          <p>Once admin assigns jobs, they will show here.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Deadline</th>
              <th>Limit</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {assignedJobs.map((assignment) => (
              <tr key={assignment.id}>
                <td>{getJobTitle(assignment)}</td>
                <td>{getCompanyName(assignment)}</td>
                <td>{assignment.deadline || "Not Set"}</td>
                <td>{assignment.submissionLimit || "No Limit"}</td>
                <td>{assignment.priority || "NORMAL"}</td>
                <td>
                  <span className="statusBadge">
                    {assignment.status || "ASSIGNED"}
                  </span>
                </td>
                <td>
                  <button
                    className="vendorSmallBtn"
                    onClick={() => {
                      setSelectedJobId(String(assignment.job?.id));
                      setActiveMenu("submitCandidate");
                    }}
                  >
                    Submit Candidate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

  const renderSubmitCandidate = () => (
    <section className="vendorTableCard fullWidth">
      <div className="vendorSectionHeader">
        <div>
          <h2>Submit Candidate</h2>
          <p>Submit candidate profile for assigned job requirement</p>
        </div>
      </div>

      <form className="vendorCandidateForm" onSubmit={handleSubmitCandidate}>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          required
        >
          <option value="">Select Assigned Job</option>
          {assignedJobs.map((assignment) => (
            <option key={assignment.id} value={assignment.job?.id}>
              {getJobTitle(assignment)} - {getCompanyName(assignment)}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="candidateName"
          placeholder="Candidate Name *"
          value={candidateForm.candidateName}
          onChange={handleCandidateChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Candidate Email *"
          value={candidateForm.email}
          onChange={handleCandidateChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Candidate Phone *"
          value={candidateForm.phone}
          onChange={handleCandidateChange}
          required
        />

        <input
          type="text"
          name="currentCompany"
          placeholder="Current Company"
          value={candidateForm.currentCompany}
          onChange={handleCandidateChange}
        />

        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={candidateForm.experience}
          onChange={handleCandidateChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills"
          value={candidateForm.skills}
          onChange={handleCandidateChange}
        />

        <input
          type="text"
          name="currentCtc"
          placeholder="Current CTC"
          value={candidateForm.currentCtc}
          onChange={handleCandidateChange}
        />

        <input
          type="text"
          name="expectedCtc"
          placeholder="Expected CTC"
          value={candidateForm.expectedCtc}
          onChange={handleCandidateChange}
        />

        <input
          type="text"
          name="noticePeriod"
          placeholder="Notice Period"
          value={candidateForm.noticePeriod}
          onChange={handleCandidateChange}
        />

        <input
          type="text"
          name="resumeUrl"
          placeholder="Resume URL / Drive Link"
          value={candidateForm.resumeUrl}
          onChange={handleCandidateChange}
        />

        <button type="submit">Submit Candidate</button>
      </form>
    </section>
  );

  const renderMyCandidates = () => (
    <section className="vendorTableCard fullWidth">
      <div className="vendorSectionHeader">
        <div>
          <h2>My Candidates</h2>
          <p>Track submitted candidates and their hiring status</p>
        </div>

        <button onClick={() => setActiveMenu("submitCandidate")}>
          + Submit Candidate
        </button>
      </div>

      {candidates.length === 0 ? (
        <div className="vendorEmptyBox">
          <h3>No candidates submitted</h3>
          <p>Candidate submissions will appear here after upload.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Email</th>
              <th>Job</th>
              <th>Experience</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.candidateName}</td>
                <td>{candidate.email}</td>
                <td>{candidate.job?.jobTitle || "Job"}</td>
                <td>{candidate.experience || "-"}</td>
                <td>
                  <span className="statusBadge success">
                    {candidate.status || "SUBMITTED"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

  const renderInterviews = () => {
    const interviewCandidates = candidates.filter(
      (candidate) => candidate.status === "INTERVIEW_SCHEDULED"
    );

    return (
      <section className="vendorTableCard fullWidth">
        <div className="vendorSectionHeader">
          <div>
            <h2>Interviews</h2>
            <p>Interview updates for your submitted candidates</p>
          </div>
        </div>

        {interviewCandidates.length === 0 ? (
          <div className="vendorEmptyBox">
            <h3>No interviews scheduled</h3>
            <p>Scheduled interviews will appear here.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {interviewCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.candidateName}</td>
                  <td>{candidate.job?.jobTitle || "Job"}</td>
                  <td>
                    <span className="statusBadge">
                      {candidate.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    );
  };

  const renderProfile = () => (
    <section className="vendorTableCard fullWidth">
      <div className="vendorSectionHeader">
        <div>
          <h2>Vendor Profile</h2>
          <p>Your vendor profile and account information</p>
        </div>
      </div>

      <div className="vendorProfileDetails">
        <div>
          <label>Name</label>
          <p>{vendorName}</p>
        </div>

        <div>
          <label>Email</label>
          <p>{vendorEmail}</p>
        </div>

        <div>
          <label>Role</label>
          <p>Vendor</p>
        </div>

        {currentVendor && (
          <>
            <div>
              <label>Company</label>
              <p>{currentVendor.companyName}</p>
            </div>

            <div>
              <label>Phone</label>
              <p>{currentVendor.phone}</p>
            </div>

            <div>
              <label>Service Type</label>
              <p>{currentVendor.serviceType}</p>
            </div>

            <div>
              <label>Status</label>
              <p>{currentVendor.status}</p>
            </div>

            <div>
              <label>Address</label>
              <p>{currentVendor.address}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return renderDashboard();

      case "assignedJobs":
        return renderAssignedJobs();

      case "submitCandidate":
        return renderSubmitCandidate();

      case "myCandidates":
        return renderMyCandidates();

      case "interviews":
        return renderInterviews();

      case "profile":
        return renderProfile();

      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <NavBar />

      <div className="vendorProDashboard">
        <aside className="vendorProSidebar">
          <div>
            <div className="vendorProLogoBox">
              <div className="vendorProLogo">V</div>
              <div>
                <h2>Vendor Panel</h2>
                <p>Evolve Portal</p>
              </div>
            </div>

            <ul className="vendorProMenu">
              <li
                className={activeMenu === "dashboard" ? "active" : ""}
                onClick={() => setActiveMenu("dashboard")}
              >
                <FaTachometerAlt /> Dashboard
              </li>

              <li
                className={activeMenu === "assignedJobs" ? "active" : ""}
                onClick={() => setActiveMenu("assignedJobs")}
              >
                <FaBriefcase /> Assigned Jobs
              </li>

              <li
                className={activeMenu === "submitCandidate" ? "active" : ""}
                onClick={() => setActiveMenu("submitCandidate")}
              >
                <FaUserPlus /> Submit Candidate
              </li>

              <li
                className={activeMenu === "myCandidates" ? "active" : ""}
                onClick={() => setActiveMenu("myCandidates")}
              >
                <FaUsers /> My Candidates
              </li>

              <li
                className={activeMenu === "interviews" ? "active" : ""}
                onClick={() => setActiveMenu("interviews")}
              >
                <FaClipboardList /> Interviews
              </li>

              <li
                className={activeMenu === "profile" ? "active" : ""}
                onClick={() => setActiveMenu("profile")}
              >
                <FaCog /> Profile
              </li>
            </ul>
          </div>

          <button className="vendorLogoutBtn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        <main className="vendorProMain">
          <div className="vendorTopbar">
            <div>
              <h1>
                {activeMenu === "dashboard"
                  ? "Vendor Dashboard"
                  : activeMenu === "assignedJobs"
                  ? "Assigned Jobs"
                  : activeMenu === "submitCandidate"
                  ? "Submit Candidate"
                  : activeMenu === "myCandidates"
                  ? "My Candidates"
                  : activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
              </h1>
              <p>Welcome back, {vendorName}</p>
            </div>

            <div className="vendorTopbarRight">
              <div className="vendorSearchBox">
                <FaSearch />
                <input type="text" placeholder="Search..." />
              </div>

              <button className="vendorIconBtn">
                <FaBell />
              </button>

              <button className="vendorDateBtn">
                <FaCalendarAlt />
                Today
              </button>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default VendorDashboard;