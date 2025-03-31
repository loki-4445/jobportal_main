import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Update.css";
import logo from "../../assets/logo.png";
import figure from "../../assets/figure.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Update = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    skills: "",
    resume: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("data");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setFormData({
        fullName: userData.fullname || "",
        phone: userData.phonenumber || "",
        email: userData.email || "",
        password: "",
        role: userData.role || "",
        skills: Object.values(userData.skills || {}).join(", ") || "",
        resume: userData.resume || "",
      });
    }
  }, []);

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/;


    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password = "Must be 8+ characters, include uppercase, number & special character";
    }
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestBody = {
      fullname: formData.fullName,
      phonenumber: formData.phone,
      email: formData.email,
      role: formData.role,
      skills: formData.skills.split(", "),
      resume: formData.resume,
    };
    if (formData.password) requestBody.password = formData.password;

    try {
      const response = await fetch("https://jobportal-backend-5sy0.onrender.com/user-api/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      sessionStorage.setItem("data", JSON.stringify(requestBody));
      const data = await response.json();
      alert(data.message);
      navigate('/home')
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="JobPortal Logo" />
          JobPortal
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </nav>
      <div className="update-container">
        <img src={figure} alt="3D Figure" className="figure-img" />
        <div className="update-box">
          <h2 className="update-title">Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}

            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            {errors.phone && <span className="error-message">{errors.phone}</span>}

            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error-message">{errors.email}</span>}

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" className="eye-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}

            <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
            {errors.role && <span className="error-message">{errors.role}</span>}

            <input type="text" name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleChange} />
            {errors.skills && <span className="error-message">{errors.skills}</span>}

            <button type="submit" className="edit-btn">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update;
