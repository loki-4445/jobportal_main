import React, { useEffect, useState } from "react";
import "./Home.css";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import lokeshPic from "../../assets/lokesh.jpg";
import sivaniPic from "../../assets/sivani.png";
import mrudulaPic from "../../assets/mrudula.jpg";
import subhashPic from "../../assets/subhash.jpg";

const Home = () => {
  const [liveJobs, setLiveJobs] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  async function fetchJobCount() {
    try {
      const res = await fetch("http://localhost:4000/recruiter-api/alljobs");
      const jobData = await res.json();
      if (jobData.status === "success" && Array.isArray(jobData.jobs)) {
        setLiveJobs(jobData.jobs.length);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  async function fetchCompaniesCount() {
    try {
      const res = await fetch("http://localhost:4000/recruiter-api/recruiters");
      const companyData = await res.json();
      if (companyData.status === "success" && Array.isArray(companyData.recruiters)) {
        setTotalCompanies(companyData.recruiters.length);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }

  async function fetchUserCount() {
    try {
      const res = await fetch("http://localhost:4000/user-api/all-users");
      const userData = await res.json();
      if (userData.status === "success" && Array.isArray(userData.payload)) {
        setTotalUsers(userData.payload.length);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchJobCount();
    fetchCompaniesCount();
    fetchUserCount();
  }, []);

  const developers = [
    {
      name: "Lokesh Gandham",
      rollNo: "22501A0547",
      email: "gandhamlokesh5@gmail.com",
      github: "https://github.com/loki-4445",
      linkedin: "https://www.linkedin.com/in/lokeshgandham/",
      image: lokeshPic,
    },
    {
      name: "Sivani Marepalli",
      rollNo: "23505A0506",
      email: "sivanimarepalli@gmail.com",
      github: "https://github.com/sivanimarepalli",
      linkedin: "https://www.linkedin.com/in/sivani-marepalli-96b1a228a/",
      image: sivaniPic,
    },
    {
      name: "Mrudula Adapala",
      rollNo: "23505A0501",
      email: "mrudulaadapala3@gmail.com",
      github: "https://github.com/MrudulaAdapala25",
      linkedin: "https://www.linkedin.com/in/mrudula-adapala-297466295/",
      image: mrudulaPic,
    },
    {
      name: "L Subhash Garika",
      rollNo: "22501A0550",
      email: "garikasubhash@gmail.com",
      github: "https://github.com/Pencilsubhash",
      linkedin: "https://www.linkedin.com/in/garika-subhash-417583288/",
      image: subhashPic,
    },
  ];

  return (
    <div>
      <div className="relative">
        <img
          src="https://storage.googleapis.com/a1aa/image/Ui2U-u0CJq6Awp00apsVFseYAWPAfiWcSJmlrnmKohE.jpg"
          alt="Background"
          className="background-image"
        />
        <div className="overlay">
          <h1 className="title">
            Find Nearby Jobs <span className="highlight">Sales Marketing</span>
          </h1>
          <p className="subtitle">It is a Long Established Fact That a Reader Will be Distracted by The Readable.</p>
        </div>
      </div>

      <h2 className="developers-heading">Meet Our Developers</h2>
      <div className="profile-card-container">
        {developers.map((dev, index) => (
          <div key={index} className="profile-card">
            <img src={dev.image} alt={dev.name} className="profile-pic" />
            <h3>{dev.name}</h3>
            <p className="roll-number">{dev.rollNo}</p>
            <div className="profile-icons">
              <a href={`mailto:${dev.email}`} className="icon"><FaEnvelope /></a>
              <a href={dev.github} target="_blank" rel="noopener noreferrer" className="icon"><FaGithub /></a>
              <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="icon"><FaLinkedin /></a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="stats-heading">Platform Statistics</h2>
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-icon">📁</div>
          <h3>{liveJobs}</h3>
          <p>Live Jobs</p>
        </div>
        <div className="stat-box">
          <div className="stat-icon">👤</div>
          <h3>{totalUsers}</h3>
          <p>Job Candidates</p>
        </div>
        <div className="stat-box">
          <div className="stat-icon">💬</div>
          <h3>{totalUsers}</h3>
          <p>Active Resume</p>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🏢</div>
          <h3>{totalCompanies}</h3>
          <p>Companies</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
