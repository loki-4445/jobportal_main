import React, { useState, useEffect } from "react";
import "./OnTrend.css";

const OnTrend = () => {
  const [jobs, setJobs] = useState([]); // Initialize as an array

  async function getJobs() {
    try {
      const res = await fetch("http://localhost:4000/recruiter-api/top-jobs");
      const jobData = await res.json();

      if (jobData.status === "success" && Array.isArray(jobData.jobs)) {
        setJobs(jobData.jobs); // Extract the jobs array
      } else {
        console.error("Invalid jobs data:", jobData);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  useEffect(() => {
    getJobs();
  }, []); // Runs only once on component mount

  async function applyForJob(recruiterEmail, jobTitle) {
    const user = JSON.parse(sessionStorage.getItem("data")); // Get user data

    if (!user) {
      alert("Please log in before applying for jobs.");
      return;
    }

    const applicationData = {
      recruiterEmail, // Recruiter's email
      jobTitle, // Job title
      applicantEmail: user.email, // User email
      applicantName: user.fullname, // User name
      applicantNumber: user.phonenumber,
      resumeUrl: user.resume || "", // Resume link from sessionStorage
    };

    try {
      const response = await fetch("http://localhost:4000/recruiter-api/apply-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Application submitted successfully!");
      } else {
        alert(result.message || "Failed to apply for the job.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="ontrend-container">
      <h2 className="ontrend-title">Latest Jobs</h2>
      <p className="ontrend-subtitle">Exciting career opportunities await you!</p>
      <div className="ontrend-grid">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3 className="job-title">{job.jobTitle}</h3>
              <p className="job-company"><strong>Company:</strong> {job.companyName || "N/A"}</p>
              <p className="job-description">{job.jobDescription}</p>
              <p className="job-salary"><strong>Salary:</strong> {job.salary}</p>
              <p className="job-mode"><strong>Mode:</strong> {job.mode}</p>
              <p className="job-type"><strong>Type:</strong> {job.jobType}</p>

              <button 
                className="apply-button" 
                onClick={() => applyForJob(job.recruiterEmail, job.jobTitle)}
              >
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <p>Loading jobs...</p>
        )}
      </div>
    </div>
  );
};

export default OnTrend;
