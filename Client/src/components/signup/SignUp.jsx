import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import logo from "../../assets/Logo.png";
import figure from "../../assets/fig.png";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    skills: "",
    linkedin: "",
    resume: null,
  });
  const [errors, setErrors] = useState({});
  sessionStorage.clear()
  // Validation Logic
  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phone.trim() || isNaN(formData.phone) || formData.phone.length !== 10) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.email.trim() || !formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password.trim() || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.linkedin.trim()) newErrors.linkedin = "LinkedIn URL is required";
    
    if (!formData.resume) {
      newErrors.resume = "Resume upload is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, resume: file });
      setErrors({ ...errors, resume: "" }); // Clear error message if valid file
    } else {
      setErrors({ ...errors, resume: "Only PDF files are allowed" });
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullName);
      formDataToSend.append("phonenumber", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("skills", formData.skills);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("resume", formData.resume);
  
      try {
        const response = await fetch("https://jobportal-backend-5sy0.onrender.com/user-api/register", {
          method: "POST",
          body: formDataToSend,
        });
  
        const data = await response.json();
  
        if (data.status === "success") {
          console.log("Signup successful!");
          navigate("/login");
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, general: data.message }));
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ general: "An error occurred. Please try again later." });
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
        <div className="logo">
          <img src={logo} alt="JobPortal Logo" /> JobPortal
        </div>
        <button className="signup-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </nav>

      <div className="signup-container">
        <img src={figure} alt="3D Figure" />
        <div className="signup-box">
          <h2>Job Seeker Sign Up</h2>

          {/* Error message display at the top */}
          {errors.general && <div className="error-message general-error">{errors.general}</div>}

          <form onSubmit={handleSubmit}>
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            {errors.email && <span className="error-message">{errors.email}</span>}
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {errors.role && <span className="error-message">{errors.role}</span>}
            <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
            {errors.skills && <span className="error-message">{errors.skills}</span>}
            <input type="text" name="skills" placeholder="Skills (separated with commas)" value={formData.skills} onChange={handleChange} />
            {errors.linkedin && <span className="error-message">{errors.linkedin}</span>}
            <input type="text" name="linkedin" placeholder="LinkedIn Profile" value={formData.linkedin} onChange={handleChange} />
            <div className="upload-container">
              <input
                type="file"
                id="resume-upload"
                className="upload-input"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload"
                className={`upload-btn ${formData.resume ? "uploaded" : ""}`}
              >
                {formData.resume ? "Resume Uploaded" : "Upload Resume"}
              </label>
              {errors.resume && <span className="error-message">{errors.resume}</span>}
</div>


            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
