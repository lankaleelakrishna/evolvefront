import React, { useEffect, useState } from "react";
import "./CandidateMockInterviewResult.css";

const CandidateMockInterviewResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockInterviewResult();
  }, []);

  const fetchMockInterviewResult = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setResult(null);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/mock-interview/result/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setResult(null);
        return;
      }

      const data = await response.json();

      if (!data || data.status === "NOT_FOUND") {
        setResult(null);
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("Mock interview result error:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="candidateMockResultWrapper">
        <div className="candidateMockResultCard">
          <p className="candidateMockLoadingText">
            Loading mock interview result...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="candidateMockResultWrapper">
        <div className="candidateMockResultCard emptyResult">
          <h2>Mock Interview Result</h2>
          <p>No mock interview result found yet.</p>
          <span>
            Once you attend a mock interview, your AI score and feedback will be
            displayed here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="candidateMockResultWrapper">
      <div className="candidateMockResultHeader">
        <div>
          <h2>Mock Interview Result</h2>
          <p>Your latest AI interview performance summary</p>
        </div>

        <span className="candidateMockStatus">
          {result.status || "COMPLETED"}
        </span>
      </div>

      <div className="candidateMockScoreCard">
        <div>
          <h1>{result.score || 0}%</h1>
          <p>Latest AI Interview Score</p>
        </div>

        <div className="candidateMockScoreCircle">{result.score || 0}%</div>
      </div>

      <div className="candidateMockInfoGrid">
        <div className="candidateMockInfoBox">
          <h4>Job Role</h4>
          <p>{result.jobRole || "Not Available"}</p>
        </div>

        <div className="candidateMockInfoBox">
          <h4>Interview Date</h4>
          <p>{result.interviewDate || "Not Available"}</p>
        </div>

        <div className="candidateMockInfoBox">
          <h4>Interview Type</h4>
          <p>{result.interviewType || "AI Mock Interview"}</p>
        </div>
      </div>

      <div className="candidateMockFeedbackCard">
        <h3>AI Feedback</h3>
        <p>{result.feedback || "Feedback not available."}</p>

        {/* <h3>Strengths</h3>
        <p>{result.strengths || "Strengths not available."}</p>

        <h3>Improvement Areas</h3>
        <p>{result.weaknesses || "Improvement details not available."}</p> */}
      </div>
    </div>
  );
};

export default CandidateMockInterviewResult;