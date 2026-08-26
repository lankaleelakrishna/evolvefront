import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import "./ManageAdmins.css";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import axios from "axios";

const ManageAdmins = () => {
  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingAdmin, setEditingAdmin] =
    useState(null);

  const [admins, setAdmins] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      role: "ADMIN",
      status: "ACTIVE",
      department: "",
    });

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admins/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = res.data.map(
        (user) => ({
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: "ADMIN",
          status: user.status,
          department:
            user.department,
        })
      );

      setAdmins(formatted);
    } catch (error) {
      console.error(
        "Error fetching admins:",
        error
      );
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) =>
      `${admin.name} ${admin.email} ${admin.status} ${admin.department}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [admins, search]);

  const openAddModal = () => {
    setEditingAdmin(null);

    setFormData({
      name: "",
      email: "",
      role: "ADMIN",
      status: "ACTIVE",
      department: "",
    });

    setShowModal(true);
  };

  const openEditModal = (
    admin
  ) => {
    setEditingAdmin(admin.id);
    setFormData(admin);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingAdmin) {
        await axios.put(
          `http://localhost:8080/api/admins/${editingAdmin}`,
          {
            fullName:
              formData.name,
            email:
              formData.email,
            department:
              formData.department,
            status:
              formData.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/admins/add",
          {
            fullName:
              formData.name,
            email:
              formData.email,
            department:
              formData.department,
            status:
              formData.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      fetchAdmins();
      setShowModal(false);
    } catch (error) {
      console.error(
        "Save admin error:",
        error
      );
    }
  };

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this admin?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/admins/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAdmins();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );
    }
  };

  const toggleStatus = async (
    admin
  ) => {
    try {
      const newStatus =
        admin.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      await axios.put(
        `http://localhost:8080/api/admins/status/${admin.id}?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmins((prev) =>
        prev.map((a) =>
          a.id === admin.id
            ? {
                ...a,
                status: newStatus,
              }
            : a
        )
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Toggle failed. Check console."
      );
    }
  };

  return (
    <div className="manageAdminsCard">
      <div className="manageAdminsHeader">
        <h2>Manage Admins</h2>

        <div className="manageAdminsActions">
          <input
            type="text"
            placeholder="Search admins..."
            className="manageAdminsSearchInput"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <button
            className="manageAdminsPrimaryBtn"
            onClick={openAddModal}
          >
            <FaPlus />
            Add Admin
          </button>
        </div>
      </div>

      <div className="manageAdminsTableWrapper">
        <table className="manageAdminsTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmins.length >
            0 ? (
              filteredAdmins.map(
                (admin) => (
                  <tr
                    key={admin.id}
                  >
                    <td>
                      {admin.name}
                    </td>

                    <td>
                      {admin.email}
                    </td>

                    <td>
                      {admin.role}
                    </td>

                    <td>
                      <span
                        className={`manageAdminsStatus ${admin.status.toLowerCase()}`}
                      >
                        {
                          admin.status
                        }
                      </span>
                    </td>

                    <td>
                      {
                        admin.department
                      }
                    </td>

                    <td>
                      <div className="manageAdminsActionGroup">
                        <button
                          className="manageAdminsEditBtn"
                          onClick={() =>
                            openEditModal(
                              admin
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="manageAdminsToggleBtn"
                          onClick={() =>
                            toggleStatus(
                              admin
                            )
                          }
                        >
                          Toggle
                        </button>

                        <button
                          className="manageAdminsDeleteBtn"
                          onClick={() =>
                            handleDelete(
                              admin.id
                            )
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="manageAdminsNoData"
                >
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="manageAdminsModalOverlay">
          <div className="manageAdminsModal">
            <div className="manageAdminsModalHeader">
              <h2>
                {editingAdmin
                  ? "Edit Admin"
                  : "Add Admin"}
              </h2>

              <button
                className="manageAdminsModalClose"
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                <FaTimes />
              </button>
            </div>

            <form
              className="manageAdminsForm"
              onSubmit={handleSave}
            >
              <input
                type="text"
                placeholder="Full Name"
                value={
                  formData.name
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={
                  formData.email
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Department"
                value={
                  formData.department
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department:
                      e.target
                        .value,
                  })
                }
              />

              <select
                value={
                  formData.status
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status:
                      e.target
                        .value,
                  })
                }
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>
              </select>

              <div className="manageAdminsFormActions">
                <button
                  type="button"
                  className="manageAdminsCancelBtn"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="manageAdminsSaveBtn"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;