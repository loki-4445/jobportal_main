import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo.png";
import figure from "../../assets/figure.png";

const Login = ({ setUserType,userType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [invalid, setInvalid] = useState("");

  // Redirect if already logged in
  // useEffect(() => {
  //   const userType = sessionStorage.getItem("userType");
  //   if (userType === "jobSeeker") {
  //     navigate("/home", { replace: true });
  //   }
  // }, [navigate]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
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
        const response = await fetch("https://jobportal-backend-5sy0.onrender.com/user-api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.status === "success") {
          sessionStorage.setItem("data", JSON.stringify(data.user));
          setUserType("jobSeeker");
          sessionStorage.setItem("userType", "jobSeeker");
          navigate("/home");
        } else {
          setInvalid(data.message);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        setErrors({ general: "An error occurred. Please try again later." });
      }
    }
  };

  
  useEffect(() => {
    console.log("Received userType in Login:", userType);
  }, [userType]);
  
  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="JobPortal Logo" />
          JobPortal
        </div>
        <button className="signup-button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </nav>

      <div className="login-container">
        <img src={figure} alt="3D Figure" />
        <div className="login-box">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            {invalid && <p className="error-message">{invalid}</p>}
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button type="submit">Log in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
