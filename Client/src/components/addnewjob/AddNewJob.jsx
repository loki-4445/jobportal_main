import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddNewJob.css";
import backgroundImage from "../../assets/Image 15.png";

const AddNewJob = () => {
  const navigate = useNavigate();

  // ✅ Safely retrieve recruiter email
  const recruiterData = sessionStorage.getItem("recruiter");
  let recruiterEmail = "";

  if (recruiterData) {
    try {
      recruiterEmail = JSON.parse(recruiterData).email || "";
    } catch (error) {
      console.error("Invalid recruiter data in sessionStorage:", error);
    }
  }

  const [formData, setFormData] = useState({
    email: recruiterEmail,
    jobTitle: "",
    jobDescription: "",
    salary: "",
    mode: "",
    jobType: "",
    keywords: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch("http://localhost:4000/recruiter-api/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Job posted successfully!" });
        alert("Job posted successfully!");
        navigate("/postedjob");

        // ✅ Reset form while keeping the email
        setFormData({
          email: recruiterEmail, // ✅ Keep original recruiter email
          jobTitle: "",
          jobDescription: "",
          salary: "",
          mode: "",
          jobType: "",
          keywords: "",
        });
      } else {
        throw new Error(result.message || "Failed to post job");
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="add-job-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="add-job-content">
        <h2 className="add-job-title">Add New Job</h2>

        {message && (
          <p className={`message ${message.type === "success" ? "success" : "error"}`}>
            {message.text}
          </p>
        )}

        <form className="add-job-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
          <textarea
            name="jobDescription"
            placeholder="Job Description"
            value={formData.jobDescription}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
          <input
            type="text"
            name="salary"
            placeholder="Salary (e.g., 80,000 - 100,000 USD per year)"
            value={formData.salary}
            onChange={handleChange}
            required
          />
          <select name="mode" value={formData.mode} onChange={handleChange} required>
            <option value="">Select Mode</option>
            <option value="Remote">Remote</option>
            <option value="On-Site">On-Site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <select name="jobType" value={formData.jobType} onChange={handleChange} required>
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <input
            type="text"
            name="keywords"
            placeholder="Keywords (comma-separated)"
            value={formData.keywords}
            onChange={handleChange}
            required
          />
          <button type="submit" className="post-job-button">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewJob;
