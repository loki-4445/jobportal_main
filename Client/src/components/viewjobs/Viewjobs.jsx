  import React, { useEffect, useState } from "react";
  import "./ViewJobs.css";

  function ViewJobs() {
    const [jobs, setJobs] = useState([]); // Initialize jobs array
    const [loading, setLoading] = useState(true);

    async function getJobs() {
      try {
        const res = await fetch("http://localhost:4000/recruiter-api/alljobs"); // Corrected endpoint
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

    useEffect(() => {
      getJobs();
    }, []);

    async function applyForJob(recruiterEmail, jobTitle) {
      const user = JSON.parse(sessionStorage.getItem("userData")); // Get user data
      console.log(user)

      if (!user) {
        alert("Please log in before applying for jobs.");
        return;
      }

      const applicationData = {
        recruiterEmail, // Recruiter's email
        jobTitle, // Job title
        applicantEmail: user.email, // User email
        applicantName: user.fullname, // User name
        applicantNumber:user.phonenumber,
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
              >
                Apply Now
              </button>
            </div>
          ))
        )}
      </div>
    );
  }

  export default ViewJobs;
