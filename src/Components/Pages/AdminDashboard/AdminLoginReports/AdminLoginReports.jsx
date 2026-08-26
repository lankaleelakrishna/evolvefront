import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaFileExcel, FaFilePdf, FaChevronDown } from "react-icons/fa";
import "./AdminLoginReports.css";

const AdminLoginReports = () => {
    const today = new Date().toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState(today);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const fetchLogs = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `http://localhost:8080/api/login-logs/by-date?date=${selectedDate}`,
                getAuthHeaders()
            );

            setLogs(res.data || []);
        } catch (error) {
            console.error("Login logs fetch error:", error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [selectedDate]);

    const downloadFile = async (type) => {
        try {
            const token = localStorage.getItem("token");

            const url =
                type === "excel"
                    ? `http://localhost:8080/api/login-logs/excel?date=${selectedDate}`
                    : `http://localhost:8080/api/login-logs/pdf?date=${selectedDate}`;

            const fileName =
                type === "excel"
                    ? `login-report-${selectedDate}.xlsx`
                    : `login-report-${selectedDate}.pdf`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                alert(`${type.toUpperCase()} download failed`);
                return;
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(fileUrl);
            setShowDownloadMenu(false);
        } catch (error) {
            console.error(`${type} download error:`, error);
            alert(`Something went wrong while downloading ${type.toUpperCase()}`);
        }
    };

    return (
        <div className="adminLoginReportsCard">
            <div className="adminLoginReportsHeader">
                <div>
                    <h2>Daily Login Reports</h2>
                    <p>View and download user login details by date.</p>
                </div>

                <div className="adminLoginReportsActions">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <div className="loginDownloadDropdownWrapper">
                        <button
                            className="loginDownloadMainBtn"
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        >
                            <FaDownload />
                            Download
                            <FaChevronDown className="loginDownloadArrow" />
                        </button>

                        {showDownloadMenu && (
                            <div className="loginDownloadDropdownMenu">
                                <button onClick={() => downloadFile("excel")}>
                                    <FaFileExcel />
                                    Download Excel
                                </button>

                                <button onClick={() => downloadFile("pdf")}>
                                    <FaFilePdf />
                                    Download PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="adminLoginReportsTableWrapper">
                <table className="adminLoginReportsTable">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Login Date</th>
                            <th>Login Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="adminLoginReportsEmpty">
                                    Loading login reports...
                                </td>
                            </tr>
                        ) : logs.length > 0 ? (
                            logs.map((log, index) => (
                                <tr key={log.id}>
                                    <td>{index + 1}</td>
                                    <td>{log.userName}</td>
                                    <td>{log.email}</td>
                                    <td>{log.role}</td>
                                    <td>{log.loginDate}</td>
                                    <td>{log.loginTime}</td>
                                    <td>
                                        <span className="adminLoginStatus">
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="adminLoginReportsEmpty">
                                    No login records found for this date
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLoginReports;