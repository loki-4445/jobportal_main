//import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./SeekerHeader.css";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";

function SeekerHeader({setUserType}) {
const navigate = useNavigate();
const handleLogout = () => {
  sessionStorage.removeItem("userType");
  sessionStorage.removeItem("data");
  setUserType(null); // Clear userType in state
  navigate("/");
  window.location.reload(); // Force page refresh
};

 


  return (

    <header className="header-container  logged-in">
      <div className="left-section">
        <img src={logo} alt="JobPortal Logo" className="logo" />
        <h1 className="header-title">JobPortal</h1>
      </div>

      
        <>
          <nav className="nav-links">
            <ul>
            
                 <>
                 <li>
                   <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")} end>
                     Home
                   </NavLink>
                 </li>
                 <li>
                   <NavLink to="/ontrend" className={({ isActive }) => (isActive ? "active" : "")} end>
                     On Trends
                   </NavLink>
                 </li>
                 <li>
                   <NavLink to="/viewjobs" className={({ isActive }) => (isActive ? "active" : "")} end>
                     View Jobs
                   </NavLink>
                 </li>
               </>
                
               
            </ul>
          </nav>

          <div className="auth-section">
              <div className="user-icon" onClick={() => navigate('/update')} style={{ cursor: 'pointer' }}>
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

export default SeekerHeader;
