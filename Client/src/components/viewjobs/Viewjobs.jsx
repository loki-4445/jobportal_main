import React, { useEffect, useState } from "react";
import "./ViewJobs.css";

function ViewJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set()); // Track applied jobs

  async function getJobs() {
    try {
      const res = await fetch("https://jobportal-backend-5sy0.onrender.com/recruiter-api/alljobs");
      const jobData = await res.json();

      if (jobData.status === "success" && Array.isArray(jobData.jobs)) {
        setJobs(jobData.jobs);
      } else {
        console.error("Invalid jobs data:", jobData);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAppliedJobs() {
    const user = JSON.parse(sessionStorage.getItem("data"));
    if (!user) return;

    try {
      const res = await fetch(`https://jobportal-backend-5sy0.onrender.com/recruiter-api/applied-jobs?email=${user.email}`);
      const appliedData = await res.json();

      if (appliedData.status === "success" && Array.isArray(appliedData.jobs)) {
        setAppliedJobs(new Set(appliedData.jobs.map((job) => job.jobTitle))); 
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  }

  useEffect(() => {
    getJobs();
    fetchAppliedJobs();
  }, []);

  async function applyForJob(recruiterEmail, jobTitle) {
    const user = JSON.parse(sessionStorage.getItem("data"));
    if (!user) {
      alert("Please log in before applying for jobs.");
      return;
    }

    if (appliedJobs.has(jobTitle)) {
      alert("You have already applied for this job.");
      return;
    }

    const applicationData = {
      recruiterEmail,
      jobTitle,
      applicantEmail: user.email,
      applicantName: user.fullname,
      applicantNumber: user.phonenumber,
      resumeUrl: user.resume || "",
    };

    try {
      const response = await fetch("https://jobportal-backend-5sy0.onrender.com/recruiter-api/apply-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Application submitted successfully!");
        setAppliedJobs((prev) => new Set([...prev, jobTitle])); // Update applied jobs
      } else {
        alert(result.message || "Failed to apply for the job.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="view-jobs-container">
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map((job, index) => (
          <div key={`${job.jobId}-${job.postedAt || index}`} className="job-card">
            <h3 className="job-title">{job.jobTitle}</h3>
            <p className="job-company"><strong>Company:</strong> {job.companyName || "N/A"}</p>
            <p className="job-description">{job.jobDescription}</p>
            <p className="job-salary"><strong>Salary:</strong> {job.salary}</p>
            <p className="job-mode"><strong>Mode:</strong> {job.mode}</p>
            <p className="job-type"><strong>Type:</strong> {job.jobType}</p>
            <button 
              className="apply-btn" 
              onClick={() => applyForJob(job.recruiterEmail, job.jobTitle)}
              disabled={appliedJobs.has(job.jobTitle)}
            >
              {appliedJobs.has(job.jobTitle) ? "Already Applied" : "Apply Now"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewJobs;
