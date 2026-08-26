import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login/candidate" replace />;
  }

  const normalizedRole =
    role?.toLowerCase().trim();

  const normalizedAllowedRoles =
    allowedRoles.map((r) =>
      r.toLowerCase()
    );

  if (
    !normalizedAllowedRoles.includes(
      normalizedRole
    )
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}