import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobGiverSignup.css";
import logo from "../../assets/logo.png";
import figure from "../../assets/fig.png";

const JobGiverSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    linkedin: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    userLocation: "",
    industry: "",
  });

  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!formData.linkedin.trim()) newErrors.linkedin = "LinkedIn URL is required";
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.email.trim() || !emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.password.trim() || !passwordRegex.test(formData.password))
      newErrors.password = "Password must be 8+ characters with uppercase, number & special character";
    if (!formData.userLocation.trim()) newErrors.userLocation = "Location is required";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:4000/recruiter-api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            company: formData.companyName,
            phone: formData.phone,
            location: formData.userLocation,
            industry: formData.industry,
            jobs: [],
          }),
        });

        const data = await response.json();
        if (data.status === "success") {
          alert("Recruiter registered successfully!");
          navigate("/job-giver/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };
  function handleBack(){
    navigate('/')
  }

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={handleBack}>Back</button>
        <div className="logo" onClick={() => navigate("/")}> 
          <img src={logo} alt="JobPortal Logo" />
          JobPortal
        </div>
        <button className="signup-button" onClick={() => navigate("/job-giver/login")}> 
          Login
        </button>
      </nav>

      <div className="signup-container">
        <img src={figure} alt="3D Figure" />
        <div className="signup-box">
          <h2>Job Giver Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
            />
            {errors.companyName && <span className="error-message">{errors.companyName}</span>}

            <label>Company's LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleChange}
            />
            {errors.linkedin && <span className="error-message">{errors.linkedin}</span>}

            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}

            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}

            <label>Company's Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

            <label>Location</label>
            <input
              type="text"
              name="userLocation"
              placeholder="Enter your location"
              value={formData.userLocation}
              onChange={handleChange}
            />
            {errors.userLocation && <span className="error-message">{errors.userLocation}</span>}

            <label>Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="Enter your industry"
              value={formData.industry}
              onChange={handleChange}
            />
            {errors.industry && <span className="error-message">{errors.industry}</span>}

            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobGiverSignup;
