import React, { useEffect, useRef, useState } from "react";
import "./VAC.css";

const VAC = () => {
  const jobsRef = useRef([]);
  const [forceRender, setForceRender] = useState(0);
  const backendURL = "http://localhost:4000"; // Backend URL

  useEffect(() => {
    const recruiterData = sessionStorage.getItem("recruiter");
    console.log(recruiterData); // Check if the value exists and is a string
    
    if (recruiterData) {
        const recruiter = JSON.parse(recruiterData); // Convert string to object
        console.log(recruiter.email);
        fetch(`${backendURL}/recruiter-api/my-jobs/${recruiter.email}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.jobs)) {
          jobsRef.current = data.jobs;
          setForceRender((prev) => prev + 1);
        } else {
          console.error("Failed to fetch jobs:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      }); // Should now work correctly
    } else {
        console.log("No recruiter data found in sessionStorage.");
    }
    
    
    
  }, []);

  return (
    <div className="vac-container">
      <h2 className="vac-title">View Applied Job Candidates</h2>
      <div className="job-list">
        {jobsRef.current.length > 0 ? (
          jobsRef.current.map((job) => (
            <div key={job.jobId} className="job-card">
              <h3>{job.jobTitle}</h3>
              <h4>{job.salary}</h4>
              <h4>{job.jobType}</h4>
              <h4>{job.mode}</h4>
              <h4></h4>
              <h4 style={{color:"black"}}>Applicants:</h4>
              <div className="applicant-list">
                {job.applied && job.applied.length > 0 ? (
                  job.applied.map((applicant, index) => {
                    const resumePath = `${backendURL}${applicant.resumeUrl}`; // Construct full URL

                    return (
                      <div key={index} className="applicant-card">
                        <p><strong>Name:</strong> {applicant.applicantName || "N/A"}</p>
                        <p><strong>Email:</strong> {applicant.applicantEmail || "N/A"}</p>
                        <p>
                          <strong>Resume:</strong>{" "}
                          {applicant.resumeUrl ? (
                            <a href={resumePath} target="_blank" rel="noopener noreferrer">
                              View Resume
                            </a>
                          ) : (
                            "No Resume"
                          )}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p>No applicants yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No jobs or applicants found.</p>
        )}
      </div>
    </div>
  );
};

export default VAC;
