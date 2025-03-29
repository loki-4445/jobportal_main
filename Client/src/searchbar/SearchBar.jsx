import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      // Mock search function, replace with actual search API call
      const results = mockSearch(query);
      setSearchResults(results);
    }
  }, [location.search]);

  const mockSearch = (query) => {
    // Mock search function, replace with actual search logic
    const data = [
      { id: 1, title: "Software Engineer Job at XYZ" },
      { id: 2, title: "Frontend Developer Role at ABC" },
      { id: 3, title: "Backend Developer Position at DEF" },
    ];
    return data.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="search-results-container">
      <h2>Search Results</h2>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchBar;