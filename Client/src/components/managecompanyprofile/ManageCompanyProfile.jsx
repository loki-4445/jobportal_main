import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./ManageCompanyProfile.css";
import profileImage from "../../assets/fig.png";

const ManageCompanyProfile = () => {
  const navigate = useNavigate(); // Initialize navigation

  // Load stored recruiter data from sessionStorage
  const storedData = JSON.parse(sessionStorage.getItem("recruiter")) || {};

  const [formData, setFormData] = useState({
    companyName: storedData.company || "",
    linkedin: storedData.linkedin || "",
    fullName: storedData.fullname || "",
    phone: storedData.phone || "",
    email: storedData.email || "",
    password: storedData.password || "",
    userLocation: storedData.location || "",
    industry: storedData.industry || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://jobportal-backend-5sy0.onrender.com/recruiter-api/update-recruiter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem("recruiter", JSON.stringify(formData)); // Update sessionStorage
        alert("Profile updated successfully! ✅"); // Show success alert
        navigate("/postedjob"); // Redirect to /postedjob
      } else {
        alert(result.message || "Failed to update profile. ❌"); // Show error alert
      }
    } catch (error) {
      alert("Error updating profile. Please try again later. ❌");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <form className="profile-form" onSubmit={handleSubmit}>
          <h2 className="profile-title">Manage Profile</h2>
          <input
            type="text"
            name="companyName"
            placeholder={storedData.companyName || "Company Name"}
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="linkedin"
            placeholder={storedData.linkedin || "Company’s LinkedIn"}
            value={formData.linkedin}
            onChange={handleChange}
          />
          <input
            type="text"
            name="fullName"
            placeholder={storedData.fullName || "Full Name"}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder={storedData.phone || "Phone Number"}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={storedData.email || "Company’s Email"}
            value={formData.email}
            onChange={handleChange}
            required
          />
           <input
type="password"
     name="password"
                placeholder="New Password"
                value={storedData.password}
                onChange={handleChange}
              />
          <input
            type="text"
            name="userLocation"
            placeholder={storedData.userLocation || "Location"}
            value={formData.userLocation}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="industry"
            placeholder={storedData.industry || "Industry"}
            value={formData.industry}
            onChange={handleChange}
            required
          />
          <button type="submit" className="update-button">Update</button>
        </form>
      </div>
    </div>
  );
};

export default ManageCompanyProfile;
