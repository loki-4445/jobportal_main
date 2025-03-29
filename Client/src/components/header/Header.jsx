import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./Header.css";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";

function Header({ isLoggedIn, setIsLoggedIn }) {
  let storedUserType = null;
  let storedLoginStatus=false;
  const navigate = useNavigate();
  const [userType, setUserType] = useState(sessionStorage.getItem("userType"));

  useEffect(() => {
    storedLoginStatus = sessionStorage.getItem("isLoggedIn") === "true";
    storedUserType = sessionStorage.getItem("userType") || null;
  
    console.log("Loaded isLoggedIn:", storedLoginStatus);
    console.log("Loaded userType:", storedUserType);
    //setUserType(userType)
  
    // setIsLoggedIn(storedLoginStatus);
    // setUserType(storedUserType);

    const handleStorageChange = () => {
      setIsLoggedIn(sessionStorage.getItem("isLoggedIn") === "true");
      setUserType(sessionStorage.getItem("userType"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setIsLoggedIn]);
  console.log("IS Log In:", isLoggedIn);
  if (isLoggedIn === null || userType === null) {
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("data");

    setIsLoggedIn(false);
    setUserType(null);
    navigate("/");
  };
  useEffect(() => {
  },[])

  return (
    <header className={`header-container ${isLoggedIn ? "logged-in" : "logged-out"}`}>
      <div className="left-section">
        <img src={logo} alt="JobPortal Logo" className="logo" />
        <h1 className="header-title">JobPortal</h1>
      </div>

      {isLoggedIn ==true&& (
        <>
          <nav className="nav-links">
            <ul>
              {userType === "jobSeeker" ? (
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
                
              ) : (
                <div className="company-links">
                <NavLink to="/postedjob" className="company-btn">📌 Posted Jobs</NavLink>
                <NavLink to="/managecompanyprofile" className="company-btn">⚙️ Manage Company Profile</NavLink>
                <NavLink to="/VAC" className="company-btn">👥 View Applied Candidates</NavLink>
                <NavLink to="/addnewjob" className="company-btn">➕ Add New Job</NavLink>
              </div>
               
              )}
            </ul>
          </nav>

          <div className="auth-section">
            {sessionStorage.getItem('userType') === "jobSeeker" && (
              <div className="user-icon" onClick={() => navigate('/update')} style={{ cursor: 'pointer' }}>
                <img src={avatar} alt="User Avatar" className="avatar-img" />
              </div>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
