import React, { useState, useEffect } from "react";
import "./SearchFilter.css";
import { IoClose } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";

export default function SearchFilter({ onFilterChange, totalJobs, externalFilters }) {
  const [filters, setFilters] = useState(externalFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    setFilters(externalFilters);
    updateActiveFilters(externalFilters);
  }, [externalFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    updateActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const updateActiveFilters = (filtersObj) => {
    let count = 0;
    if (filtersObj.searchTerm) count++;
    if (filtersObj.location) count++;
    if (filtersObj.jobType) count++;
    if (filtersObj.experience) count++;
    if (filtersObj.salary) count++;
    if (filtersObj.company) count++;
    setActiveFilters(count);
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: "",
      location: "",
      jobType: "",
      experience: "",
      salary: "",
      company: "",
    };
    setFilters(resetFilters);
    setActiveFilters(0);
    onFilterChange(resetFilters);
  };

  const removeFilter = (filterName) => {
    const updatedFilters = { ...filters, [filterName]: "" };
    setFilters(updatedFilters);
    updateActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="filter-toggle-btn" onClick={toggleSidebar}>
        <FiFilter size={18} />
        <span>Filters</span>
        {activeFilters > 0 && (
          <span className="filter-badge">{activeFilters}</span>
        )}
      </button>

      {isOpen && <div className="filter-backdrop" onClick={toggleSidebar} />}

      <aside className={`search-filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <div className="filter-title">
            <FiFilter size={20} />
            <h3>Filter Jobs</h3>
          </div>
          <button className="filter-close-btn" onClick={toggleSidebar}>
            <IoClose size={24} />
          </button>
        </div>

        {activeFilters > 0 && (
          <div className="active-filters">
            {filters.searchTerm && (
              <div className="filter-tag">
                <span>{filters.searchTerm}</span>
                <button onClick={() => removeFilter("searchTerm")}>×</button>
              </div>
            )}
            {filters.company && (
              <div className="filter-tag">
                <span>{filters.company}</span>
                <button onClick={() => removeFilter("company")}>×</button>
              </div>
            )}
            {filters.location && (
              <div className="filter-tag">
                <span>{filters.location}</span>
                <button onClick={() => removeFilter("location")}>×</button>
              </div>
            )}
            {filters.jobType && (
              <div className="filter-tag">
                <span>{filters.jobType}</span>
                <button onClick={() => removeFilter("jobType")}>×</button>
              </div>
            )}
            {filters.experience && (
              <div className="filter-tag">
                <span>{filters.experience}</span>
                <button onClick={() => removeFilter("experience")}>×</button>
              </div>
            )}
            {filters.salary && (
              <div className="filter-tag">
                <span>{filters.salary}</span>
                <button onClick={() => removeFilter("salary")}>×</button>
              </div>
            )}
          </div>
        )}

        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="searchTerm" className="filter-label">
              <span>Search Jobs</span>
              <span className="required">*</span>
            </label>
            <div className="search-input-wrapper">
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                placeholder="Job title, keywords..."
                value={filters.searchTerm}
                onChange={handleInputChange}
                className="filter-input"
              />
              {filters.searchTerm && (
                <button
                  className="clear-input"
                  onClick={() => removeFilter("searchTerm")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="company" className="filter-label">
              Company
            </label>
            <div className="search-input-wrapper">
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Search company..."
                value={filters.company}
                onChange={handleInputChange}
                className="filter-input"
              />
              {filters.company && (
                <button
                  className="clear-input"
                  onClick={() => removeFilter("company")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="location" className="filter-label">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              className="filter-select"
            >
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Kochi">Kochi</option>
              <option value="London">London</option>
              <option value="Seattle">Seattle</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Seoul">Seoul</option>
              <option value="Sydney">Sydney</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Job Type</label>
            <div className="filter-radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value=""
                  checked={filters.jobType === ""}
                  onChange={handleInputChange}
                />
                <span>All Types</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value="fulltime"
                  checked={filters.jobType === "fulltime"}
                  onChange={handleInputChange}
                />
                <span>Full Time</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value="parttime"
                  checked={filters.jobType === "parttime"}
                  onChange={handleInputChange}
                />
                <span>Part Time</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value="internship"
                  checked={filters.jobType === "internship"}
                  onChange={handleInputChange}
                />
                <span>Internship</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value="contract"
                  checked={filters.jobType === "contract"}
                  onChange={handleInputChange}
                />
                <span>Contract</span>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Experience Level</label>
            <div className="filter-radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="experience"
                  value=""
                  checked={filters.experience === ""}
                  onChange={handleInputChange}
                />
                <span>All Levels</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="experience"
                  value="entry"
                  checked={filters.experience === "entry"}
                  onChange={handleInputChange}
                />
                <span>Entry Level</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="experience"
                  value="mid"
                  checked={filters.experience === "mid"}
                  onChange={handleInputChange}
                />
                <span>Mid Level</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="experience"
                  value="senior"
                  checked={filters.experience === "senior"}
                  onChange={handleInputChange}
                />
                <span>Senior Level</span>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="salary" className="filter-label">
              Salary Range (Annual)
            </label>
            <select
              id="salary"
              name="salary"
              value={filters.salary}
              onChange={handleInputChange}
              className="filter-select"
            >
              <option value="">All Salaries</option>
              <option value="0-50">$0 - $50k</option>
              <option value="50-100">$50k - $100k</option>
              <option value="100-150">$100k - $150k</option>
              <option value="150+">$150k+</option>
            </select>
          </div>

          <div className="filter-actions">
            <button
              className="filter-reset-btn"
              onClick={handleReset}
              disabled={activeFilters === 0}
            >
              Reset All
            </button>
            <p className="filter-count">
              {activeFilters} filter
              {activeFilters !== 1 ? "s" : ""} applied
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
