// Base URL for the backend API. Set REACT_APP_API_URL in the environment
// (e.g. a Vercel project env var) to point the deployed frontend at a
// publicly reachable backend. Falls back to localhost for local development.
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";
