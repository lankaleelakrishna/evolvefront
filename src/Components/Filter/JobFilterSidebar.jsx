import React, { useState } from "react";
import "./JobFilterSidebar.css";

const experienceLevels = [
  { label: "Entry Level", value: "entry", count: 11 },
  { label: "Mid Level", value: "mid", count: 31 },
  { label: "Senior Level", value: "senior", count: 20 },
];

const jobTypes = [
  { label: "Full-Time", value: "fulltime", count: 22 },
  { label: "Internship", value: "internship", count: 22 },
];

const locations = [
  { label: "Remote", value: "remote" },
  { label: "New York", value: "newyork" },
  { label: "San Francisco", value: "sanfrancisco" },
  { label: "London", value: "london" },
];

const salaryRanges = [
  { label: "$0 - $50k", value: "0-50" },
  { label: "$50k - $100k", value: "50-100" },
  { label: "$100k+", value: "100+" },
];

export default function JobFilterSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    experience: "",
    jobType: "",
    location: "",
    salary: "",
  });

  const [open, setOpen] = useState({
    location: false,
    salary: false,
    experience: false,
  });

  const handleFilter = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const toggleOpen = (section) => {
    setOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="sidebar">
      <div className="header">
        <span className="icon"></span>
        <span className="title">Job Portal</span>
      </div>
      <div className="filters-section">
        <h3>Filters</h3>

        
        <div
          className="filter-group clickable"
          onClick={() => toggleOpen("location")}
        >
          <span>Location</span>
          <span className="arrow">{open.location ? "˄" : ">"}</span>
        </div>
        {open.location && (
          <div className="sub-section">
            {locations.map((loc) => (
              <div
                key={loc.value}
                className={`sub-filter ${filters.location === loc.value ? "active" : ""}`}
                onClick={() => handleFilter("location", loc.value)}
              >
                <span>{loc.label}</span>
              </div>
            ))}
          </div>
        )}

        
        <div
          className="filter-group clickable"
          onClick={() => toggleOpen("salary")}
        >
          <span>Salary Range</span>
          <span className="arrow">{open.salary ? "˄" : ">"}</span>
        </div>
        {open.salary && (
          <div className="sub-section">
            {salaryRanges.map((sal) => (
              <div
                key={sal.value}
                className={`sub-filter ${filters.salary === sal.value ? "active" : ""}`}
                onClick={() => handleFilter("salary", sal.value)}
              >
                <span>{sal.label}</span>
              </div>
            ))}
          </div>
        )}

        
        <div
          className="filter-group clickable"
          onClick={() => toggleOpen("experience")}
        >
          <span>Experience Level</span>
          <span className="arrow">{open.experience ? "˄" : ">"}</span>
        </div>
        {open.experience && (
          <div className="sub-section">
            {experienceLevels.map((exp) => (
              <div
                key={exp.value}
                className={`sub-filter ${filters.experience === exp.value ? "active" : ""}`}
                onClick={() => handleFilter("experience", exp.value)}
              >
                <span>{exp.label}</span>
                <span className="count">({exp.count})</span>
              </div>
            ))}
          </div>
        )}

        
        <div className="sub-section">
          <div className="sub-title">Experience Level</div>
          {experienceLevels.map((exp) => (
            <div
              key={exp.value}
              className={`sub-filter ${filters.experience === exp.value ? "active" : ""}`}
              onClick={() => handleFilter("experience", exp.value)}
            >
              <span>{exp.label}</span>
              <span className="count">({exp.count})</span>
            </div>
          ))}
        </div>

        
        <div className="sub-section">
          <div className="sub-title">Job Type</div>
          {jobTypes.map((job) => (
            <div
              key={job.value}
              className={`sub-filter ${filters.jobType === job.value ? "active" : ""}`}
              onClick={() => handleFilter("jobType", job.value)}
            >
              <span>{job.label}</span>
              <span className="count">({job.count})</span>
            </div>
          ))}
          <div className="view-all">View All</div>
        </div>
      </div>
    </div>
  );
}