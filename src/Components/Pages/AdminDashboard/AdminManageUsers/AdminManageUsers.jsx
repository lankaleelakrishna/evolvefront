import React, { useState } from "react";
import {
  FaTrashAlt,
  FaUserSlash,
  FaUserCheck,
  FaFileExcel,
  FaFilePdf,
  FaDownload,
  FaChevronDown,
} from "react-icons/fa";

import "./AdminManageUsers.css";

const AdminManageUsers = ({
  filteredUsers,
  onBlockToggle,
  onDeleteUser,
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const downloadFile = async (type) => {
    try {
      const token = localStorage.getItem("token");

      const apiUrl =
        type === "excel"
          ? "http://localhost:8080/api/profile/download-excel"
          : "http://localhost:8080/api/profile/download-pdf";

      const fileName =
        type === "excel"
          ? "candidate_profiles.xlsx"
          : "candidate_profiles.pdf";

      const response = await fetch(apiUrl, {
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
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      setShowDownloadMenu(false);
    } catch (error) {
      console.error(`${type} download failed:`, error);
      alert(`Something went wrong while downloading ${type.toUpperCase()}`);
    }
  };

  return (
    <div className="adminSectionCard">
      <div className="adminSectionHeader">
        <div>
          <h2>Manage Users and Employers</h2>

          <p className="adminSectionSubText">
            Manage users, employers and export candidate profile details.
          </p>
        </div>

        <div className="adminHeaderActions">
          <div className="downloadDropdownWrapper">
            <button
              className="downloadMainBtn"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            >
              <FaDownload />
              Download
              <FaChevronDown className="downloadArrow" />
            </button>

            {showDownloadMenu && (
              <div className="downloadDropdownMenu">
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

          <span className="adminSectionCount">
            Total: {filteredUsers.length}
          </span>
        </div>
      </div>

      <div className="adminTableWrapper">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    className={
                      user.status === "ACTIVE"
                        ? "adminStatus activeStatus"
                        : "adminStatus blockedStatus"
                    }
                  >
                    {user.status}
                  </span>
                </td>

                <td>
                  <div className="adminActionBtns">
                    <button
                      className={
                        user.status === "ACTIVE"
                          ? "deleteBtn"
                          : "approveBtn"
                      }
                      onClick={() => onBlockToggle(user)}
                    >
                      {user.status === "ACTIVE" ? (
                        <>
                          <FaUserSlash />
                          Block
                        </>
                      ) : (
                        <>
                          <FaUserCheck />
                          Unblock
                        </>
                      )}
                    </button>

                    <button
                      className="rejectBtn"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      <FaTrashAlt />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="adminEmptyState">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageUsers;