import { API_BASE_URL } from "../../../../config/api";
import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import "./SystemUsers.css";

import axios from "axios";

const SystemUsers = () => {
  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/aftergrad/super-users`
      );

      const formatted = (
        res.data || []
      ).map((user) => ({
        id: user.id,

        name: user.fullName,

        email: user.email,

        type:
          user.role ===
          "EMPLOYEE"
            ? "Employer"
            : "Candidate",

        status:
          user.approvalStatus ||
          user.workStatus ||
          "PENDING",
      }));

      setUsers(formatted);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email} ${user.type} ${user.status}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [users, search]);

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/aftergrad/status/${id}?status=${status.toUpperCase()}`
      );

      fetchUsers();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );
    }
  };

  return (
    <div className="systemUsersCard">
      <div className="systemUsersHeader">
        <h2>System Users</h2>

        <input
          type="text"
          placeholder="Search users..."
          className="systemUsersSearchInput"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      <div className="systemUsersTableWrapper">
        <table className="systemUsersTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length >
            0 ? (
              filteredUsers.map(
                (user) => (
                  <tr
                    key={user.id}
                  >
                    <td>
                      {user.name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.type}
                    </td>

                    <td>
                      <span
                        className={`systemUsersStatus ${user.status.toLowerCase()}`}
                      >
                        {
                          user.status
                        }
                      </span>
                    </td>

                    <td>
                      <div className="systemUsersActionGroup">
                        <button
                          className="systemUsersApproveBtn"
                          onClick={() =>
                            updateStatus(
                              user.id,
                              "ACTIVE"
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="systemUsersPendingBtn"
                          onClick={() =>
                            updateStatus(
                              user.id,
                              "PENDING"
                            )
                          }
                        >
                          Pending
                        </button>

                        <button
                          className="systemUsersBlockBtn"
                          onClick={() =>
                            updateStatus(
                              user.id,
                              "BLOCKED"
                            )
                          }
                        >
                          Block
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="systemUsersNoData"
                >
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

export default SystemUsers;