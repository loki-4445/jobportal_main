import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extract query parameter from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("query");
    if (queryParam) {
      setQuery(queryParam);
      fetchJobs(queryParam); // Fetch jobs based on the query
    }
  }, [location]);

  // Function to fetch jobs based on the search query
  async function fetchJobs(keyword) {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/recruiter-api/jobs-by-keyword/${keyword}`);
      const data = await response.json();

      if (data.status === "success" && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  // Handle search input change
  function handleInputChange(e) {
    setQuery(e.target.value);
  }

  // Handle search form submission
  function handleSearch(e) {
    e.preventDefault();
    if (query.trim() === "") {
      return;
    }
    navigate(`/search?query=${query}`); // Update URL with search query
    fetchJobs(query); // Fetch jobs with the new query
  }

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSearch} className="searchbar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for jobs..."
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="search-results">
          <h2>Search Results for: {query}</h2>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div key={index} className="job-card">
                <h3 className="job-title">{job.jobTitle}</h3>
                <p className="job-company"><strong>Company:</strong> {job.companyName || "N/A"}</p>
                <p className="job-description">{job.jobDescription}</p>
                <p className="job-salary"><strong>Salary:</strong> {job.salary}</p>
                <p className="job-mode"><strong>Mode:</strong> {job.mode}</p>
                <p className="job-type"><strong>Type:</strong> {job.jobType}</p>
              </div>
            ))
          ) : (
            <p>No jobs found for "{query}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
