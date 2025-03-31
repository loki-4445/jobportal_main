import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./GiverHeader.css";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";

function GiverHeader({ setUserType,userType }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("isLoggedIn"));

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/job-giver/login");
      console.log(userType)
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("recruiter");
    setUserType(null); // Clear userType in state
    setIsLoggedIn(null);
  };

  return (
    userType&&<header className="header-container logged-in">
    <div className="left-section">
      <img src={logo} alt="JobPortal Logo" className="logo" />
      <h1 className="header-title">JobPortal</h1>
    </div>
    <>
      <nav className="nav-links">
        <ul>
          <div className="company-links">
            <NavLink to="/postedjob" className="company-btn">📌 Posted Jobs</NavLink>
            <NavLink to="/managecompanyprofile" className="company-btn">⚙️ Manage Company Profile</NavLink>
            <NavLink to="/VAC" className="company-btn">👥 View Applied Candidates</NavLink>
            <NavLink to="/addnewjob" className="company-btn">➕ Add New Job</NavLink>
          </div>
        </ul>
      </nav>
      <div className="auth-section">
        <div className="user-icon" onClick={() => navigate('/managecompanyprofile')} style={{ cursor: 'pointer' }}>
          <img src={avatar} alt="User Avatar" className="avatar-img" />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  </header>
  );
}

export default GiverHeader;
