import React, { useEffect, useMemo, useState } from "react";
import "./SearchBar.css";
import { IoMdSearch } from "react-icons/io";

const SearchBar = ({ jobsData = [], jobs = [], onSearch, onSearchSubmit }) => {
  const allJobs = jobsData.length > 0 ? jobsData : jobs;

  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const safeInput = inputValue || "";

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/locations/all");

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data = await response.json();
     const sortedLocations = (data || []).sort((a, b) =>
  (a.city || "").localeCompare(b.city || "")
);

setLocations(sortedLocations);
    } catch (error) {
      console.error("Location fetch error:", error);
      setLocations([]);
    }
  };

  const suggestions = useMemo(() => {
    if (!safeInput.trim()) return [];

    const keyword = safeInput.toLowerCase();

    const values = allJobs.flatMap((job) => [
      job?.title,
      job?.jobTitle,
      job?.company,
      job?.compName,
      ...(Array.isArray(job?.skills) ? job.skills : []),
      ...(job?.reqSkills ? job.reqSkills.split(",") : []),
    ]);

    const matchedSuggestions = [...new Set(values)].filter(
      (item) => item && item.toLowerCase().includes(keyword)
    );

    return [safeInput.trim(), ...matchedSuggestions]
      .filter((item, index, arr) => item && arr.indexOf(item) === index)
      .slice(0, 8);
  }, [safeInput, allJobs]);

  // ✅ CHANGED ONLY THIS FUNCTION
  const getLocationLabel = (item) => {
  if (!item) return "";

  return item.city || "";
};

const getLocationSearchValue = (item) => {
  if (!item) return "";

  return item.city || "";
};

  const applySearch = (searchText = safeInput, selectedLocation = location) => {
    const cleanText = searchText || "";
    const cleanLocation = selectedLocation || "";

    if (onSearch) {
      onSearch({
        searchTerm: cleanText.trim(),
        location: cleanLocation,
        experience: "",
      });
    }

    if (onSearchSubmit) {
      onSearchSubmit(cleanText.trim(), cleanLocation);
    }

    setShowSuggestions(false);
    setShowLocationDropdown(false);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    applySearch(safeInput, selectedLocation);
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar-box">
        <div className="searchbar-input-wrapper">
          <IoMdSearch className="search-icon" />

          <input
            type="text"
            placeholder="Job title, company, skills..."
            className="searchbar-input"
            value={safeInput}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 180);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applySearch();
              }
            }}
            autoComplete="off"
          />

          {safeInput && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setInputValue("");
                applySearch("", location);
              }}
            >
              ×
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((item, index) => (
                <button
                  type="button"
                  key={index}
                  className="suggestion-item"
                  onMouseDown={() => {
                    setInputValue(item);
                    applySearch(item, location);
                  }}
                >
                  <IoMdSearch />
                  <span>{index === 0 ? `Search for "${item}"` : item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="location-dropdown-wrapper">
          <button
            type="button"
            className="location-filter"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            onBlur={() => {
              setTimeout(() => setShowLocationDropdown(false), 180);
            }}
          >
            {location || "All Locations"}
            <span>⌄</span>
          </button>

          {showLocationDropdown && (
            <div className="location-dropdown-menu">
              <button
                type="button"
                className="location-dropdown-item"
                onMouseDown={() => handleLocationSelect("")}
              >
                All Locations
              </button>

              {locations.map((item, index) => {
                const locationLabel = getLocationLabel(item);
                const locationSearchValue = getLocationSearchValue(item);

                return (
                  <button
                    type="button"
                    className="location-dropdown-item"
                    key={index}
                    onMouseDown={() =>
                      handleLocationSelect(locationSearchValue)
                    }
                  >
                    {locationLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          className="searchbar-btn"
          onClick={() => applySearch()}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;