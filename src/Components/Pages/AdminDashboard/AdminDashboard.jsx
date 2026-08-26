import React, { useMemo, useState, useEffect } from "react";
import {
  FaBell,
  FaRegCalendarAlt,
  FaSearch,
  FaUsers,
  FaUserTie,
  FaReply,
  FaTrash,
} from "react-icons/fa";
import "./AdminDashboard.css";

import AdminSidebar from "./AdminSidebar/AdminSidebar";
import AdminAnalytics from "./AdminAnalytics/AdminAnalytics";
import AdminManageUsers from "./AdminManageUsers/AdminManageUsers";
import AdminCompanies from "./AdminCompanies/AdminCompanies";
import AdminJobs from "./AdminJobs/AdminJobs";
import AdminLoginReports from "./AdminLoginReports/AdminLoginReports";
import NavBar from "../../HomePage/NavBar/NavBar";
import AdminManageCourses from "./AdminManageCourses/AdminManageCourses";

/* Vendor Management Import */
import VendorManagement from "../../Payroll/VendorManagement";

import axios from "axios";

const AdminSupportRequests = ({ supportRequests, fetchSupportRequests }) => {
  const [replyText, setReplyText] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSendReply = async (id) => {
    const reply = replyText[id];

    if (!reply || !reply.trim()) {
      showToast("warning", "Please enter reply message");
      return;
    }

    try {
      setLoadingId(id);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/support/reply/${id}`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("success", "Reply sent successfully to user's email");

      setReplyText((prev) => ({
        ...prev,
        [id]: "",
      }));

      fetchSupportRequests();
    } catch (error) {
      console.error("Reply error:", error);
      showToast("error", "Failed to send reply");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/support/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("success", "Support request deleted successfully");
      fetchSupportRequests();
    } catch (error) {
      console.error("Delete support request error:", error);
      showToast("error", "Failed to delete request");
    }
  };

  return (
    <div className="adminSupportSection">
      {toast.show && (
        <div className={`adminToastMessage ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="adminSupportHeader">
        <div>
          <h2>Support Requests</h2>
          <p>View user queries and reply directly through email.</p>
        </div>

        <span className="adminSupportCount">
          Total: {supportRequests.length}
        </span>
      </div>

      {supportRequests.length === 0 ? (
        <div className="adminSupportEmpty">
          <h3>No support requests found</h3>
          <p>New user support requests will appear here.</p>
        </div>
      ) : (
        <div className="adminSupportGrid">
          {supportRequests.map((request) => {
            const status = request.status || "OPEN";

            return (
              <div className="adminSupportCard" key={request.id}>
                <div className="adminSupportCardTop">
                  <div>
                    <h3>{request.name}</h3>
                    <p>{request.email}</p>
                  </div>

                  <span
                    className={
                      status === "REPLIED"
                        ? "supportStatus replied"
                        : status === "CLOSED"
                        ? "supportStatus closed"
                        : "supportStatus open"
                    }
                  >
                    {status}
                  </span>
                </div>

                <div className="adminSupportInfo">
                  <span>Category</span>
                  <strong>{request.category}</strong>
                </div>

                <div className="adminSupportMessage">
                  <span>User Message</span>
                  <p>{request.message}</p>
                </div>

                {request.adminReply && (
                  <div className="adminSupportReplyView">
                    <span>Admin Reply</span>
                    <p>{request.adminReply}</p>
                  </div>
                )}

                <textarea
                  className="adminSupportReplyInput"
                  placeholder="Type your reply here..."
                  value={replyText[request.id] || ""}
                  onChange={(e) =>
                    handleReplyChange(request.id, e.target.value)
                  }
                ></textarea>

                <div className="adminSupportActions">
                  <button
                    className="adminSupportReplyBtn"
                    onClick={() => handleSendReply(request.id)}
                    disabled={loadingId === request.id}
                  >
                    <FaReply />
                    {loadingId === request.id ? "Sending..." : "Send Reply"}
                  </button>

                  <button
                    className="adminSupportDeleteBtn"
                    onClick={() => handleDeleteRequest(request.id)}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AdminContactMessages = ({ contactMessages, fetchContactMessages }) => {
  const [replyText, setReplyText] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSendReply = async (id) => {
    const reply = replyText[id];

    if (!reply || !reply.trim()) {
      showToast("warning", "Please enter reply message");
      return;
    }

    try {
      setLoadingId(id);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/contact/reply/${id}`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("success", "Reply sent successfully to user's email");

      setReplyText((prev) => ({
        ...prev,
        [id]: "",
      }));

      fetchContactMessages();
    } catch (error) {
      console.error("Contact reply error:", error);
      showToast("error", "Failed to send reply");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("success", "Contact message deleted successfully");
      fetchContactMessages();
    } catch (error) {
      console.error("Delete contact message error:", error);
      showToast("error", "Failed to delete message");
    }
  };

  return (
    <div className="adminSupportSection">
      {toast.show && (
        <div className={`adminToastMessage ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="adminSupportHeader">
        <div>
          <h2>Contact Messages</h2>
          <p>View contact form messages and reply directly through email.</p>
        </div>

        <span className="adminSupportCount">
          Total: {contactMessages.length}
        </span>
      </div>

      {contactMessages.length === 0 ? (
        <div className="adminSupportEmpty">
          <h3>No contact messages found</h3>
          <p>New contact messages will appear here.</p>
        </div>
      ) : (
        <div className="adminSupportGrid">
          {contactMessages.map((message) => {
            const status = message.status || "OPEN";

            return (
              <div className="adminSupportCard" key={message.id}>
                <div className="adminSupportCardTop">
                  <div>
                    <h3>{message.name}</h3>
                    <p>{message.email}</p>
                  </div>

                  <span
                    className={
                      status === "REPLIED"
                        ? "supportStatus replied"
                        : status === "CLOSED"
                        ? "supportStatus closed"
                        : "supportStatus open"
                    }
                  >
                    {status}
                  </span>
                </div>

                <div className="adminSupportInfo">
                  <span>Subject</span>
                  <strong>{message.subject}</strong>
                </div>

                <div className="adminSupportMessage">
                  <span>User Message</span>
                  <p>{message.message}</p>
                </div>

                {message.adminReply && (
                  <div className="adminSupportReplyView">
                    <span>Admin Reply</span>
                    <p>{message.adminReply}</p>
                  </div>
                )}

                <textarea
                  className="adminSupportReplyInput"
                  placeholder="Type your reply here..."
                  value={replyText[message.id] || ""}
                  onChange={(e) =>
                    handleReplyChange(message.id, e.target.value)
                  }
                ></textarea>

                <div className="adminSupportActions">
                  <button
                    className="adminSupportReplyBtn"
                    onClick={() => handleSendReply(message.id)}
                    disabled={loadingId === message.id}
                  >
                    <FaReply />
                    {loadingId === message.id ? "Sending..." : "Send Reply"}
                  </button>

                  <button
                    className="adminSupportDeleteBtn"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("analytics");
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  useEffect(() => {
    let interval;
    let timeout;

    const startHeartbeat = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        return;
      }

      const sendHeartbeat = async () => {
        try {
          await axios.post(
            "http://localhost:8080/api/admin-session/heartbeat",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log("Heartbeat failed", error);

          clearInterval(interval);
          clearTimeout(timeout);

          localStorage.clear();

          window.location.href = "/login/candidate";
        }
      };

      timeout = setTimeout(() => {
        sendHeartbeat();
        interval = setInterval(sendHeartbeat, 60000);
      }, 6000);
    };

    startHeartbeat();

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSupportRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/api/support/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSupportRequests(res.data || []);
    } catch (error) {
      console.error("Support requests fetch error:", error);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/api/contact/alldetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContactMessages(res.data || []);
    } catch (error) {
      console.error("Contact messages fetch error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        await fetchUsers();
        await fetchSupportRequests();
        await fetchContactMessages();

        const companiesRes = await axios.get(
          "http://localhost:8080/api/company-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedCompanies = (companiesRes.data || []).map((c) => ({
          ...c,
          company: c.companyName,
        }));

        setCompanies(formattedCompanies);

        const jobsRes = await axios.get(
          "http://localhost:8080/api/aftergrad/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedJobs = (jobsRes.data || []).map((job) => ({
          ...job,
          id: job.id || job.jobId || job.postId,
        }));

        setJobs(formattedJobs);
      } catch (error) {
        console.error("Admin Dashboard API Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleSidebarChange = (menu) => {
    setActiveMenu(menu);
    setSearchTerm("");
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/admin/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      const token = localStorage.getItem("token");

      const newStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

      await axios.put(
        `http://localhost:8080/admin/update-status/${user.id}?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleRemoveJob = (id) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const filteredSupportRequests = useMemo(() => {
    return supportRequests.filter(
      (request) =>
        request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supportRequests, searchTerm]);

  const filteredContactMessages = useMemo(() => {
    return contactMessages.filter(
      (message) =>
        message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contactMessages, searchTerm]);

  const analytics = useMemo(() => {
    const totalUsers = users.length;

    const employers = users.filter(
      (user) =>
        user.role?.toUpperCase() === "EMPLOYEE" ||
        user.role?.toUpperCase() === "ROLE_EMPLOYEE"
    ).length;

    const candidates = users.filter(
      (user) =>
        user.role?.toUpperCase() === "CANDIDATE" ||
        user.role?.toUpperCase() === "ROLE_CANDIDATE"
    ).length;

    const blockedUsers = users.filter(
      (user) => user.status?.toUpperCase() === "BLOCKED"
    ).length;

    return {
      totalUsers,
      employers,
      candidates,
      blockedUsers,
    };
  }, [users]);

  const openSupportCount = supportRequests.filter(
    (request) => request.status === "OPEN"
  ).length;

  const openContactCount = contactMessages.filter(
    (message) => message.status === "OPEN"
  ).length;

  const summaryCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: <FaUsers />,
      subText: `${analytics.candidates} candidates`,
    },
    {
      title: "Employers",
      value: analytics.employers,
      icon: <FaUserTie />,
      subText: `${analytics.blockedUsers} blocked accounts`,
    },
  ];

  const renderPage = () => {
    switch (activeMenu) {
      case "analytics":
        return <AdminAnalytics analytics={analytics} />;

      case "users":
        return (
          <AdminManageUsers
            filteredUsers={filteredUsers}
            onBlockToggle={handleBlockToggle}
            onDeleteUser={handleDeleteUser}
          />
        );

      case "companies":
        return <AdminCompanies filteredCompanies={filteredCompanies} />;

      case "jobs":
        return (
          <AdminJobs
            filteredJobs={filteredJobs}
            onRemoveJob={handleRemoveJob}
          />
        );

      case "supportRequests":
        return (
          <AdminSupportRequests
            supportRequests={filteredSupportRequests}
            fetchSupportRequests={fetchSupportRequests}
          />
        );

      case "contactMessages":
        return (
          <AdminContactMessages
            contactMessages={filteredContactMessages}
            fetchContactMessages={fetchContactMessages}
          />
        );

      case "loginReports":
        return <AdminLoginReports />;

      case "courses":
        return <AdminManageCourses />;

      /* Vendor Management Case */
      case "vendors":
        return <VendorManagement />;

      default:
        return <AdminAnalytics analytics={analytics} />;
    }
  };

  return (
    <>
      <NavBar />

      <div className="adminDashboardLayout">
        <AdminSidebar
          activeMenu={activeMenu}
          onChangeMenu={handleSidebarChange}
          supportCount={openSupportCount}
          contactCount={openContactCount}
        />

        <main className="adminMainContent">
          <div className="adminTopbar">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Monitor and manage your Job Portal efficiently</p>
            </div>

            <div className="adminTopbarRight">
              <div className="adminSearchBox">
                <FaSearch />

                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="adminIconBtn"
                onClick={() => setActiveMenu("contactMessages")}
              >
                <FaBell />
                <span className="adminNotificationCount">
                  {openSupportCount + openContactCount}
                </span>
              </button>

              <button className="adminDateBtn">
                <FaRegCalendarAlt />
                <span>Today</span>
              </button>
            </div>
          </div>

          <div className="adminCardsGrid">
            {summaryCards.map((card, index) => (
              <div className="adminSummaryCard" key={index}>
                <div className="adminSummaryIcon">{card.icon}</div>

                <div className="adminSummaryText">
                  <h3>{card.title}</h3>
                  <h2>{card.value}</h2>
                  <p>{card.subText}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="adminDashboardSections">{renderPage()}</div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;