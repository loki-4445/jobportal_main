import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostedJob.css";

const PostedJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Parse sessionStorage safely
    const recruiterData = sessionStorage.getItem("recruiter");
    if (!recruiterData) {
      setError("Recruiter not found in local storage.");
      setLoading(false);
      return;
    }

    let userEmail;
    try {
      const parsedData = JSON.parse(recruiterData);
      userEmail = parsedData.email;
    } catch (err) {
      setError("Invalid recruiter data.");
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(`https://jobportal-backend-5sy0.onrender.com/recruiter-api/my-jobs/${userEmail}`);
        const data = await response.json();
        if (response.ok) {
          setJobs(data.jobs);
          console.log(data)
        } else {
          throw new Error(data.message || "Failed to fetch jobs");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // ✅ Dependency array remains empty because sessionStorage does not trigger re-renders

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="posted-jobs-container">
      <h2 className="title">Job Postings</h2>

      {jobs.length === 0 ? (
        <NoJobsMessage onPostJob={() => navigate("/addnewjob")} />
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <JobCard key={job.jobId} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ No Jobs Component
const NoJobsMessage = ({ onPostJob }) => (
  <p className="no-jobs" onClick={onPostJob} style={{ cursor: "pointer", color: "blue" }}>
    No jobs found. Click here to post a new job.
  </p>
);

// ✅ Job Card Component
const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.jobTitle}</h3>
      <p><strong>Mode:</strong> {job.mode}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Posted On:</strong> {new Date(job.postedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default PostedJob;
