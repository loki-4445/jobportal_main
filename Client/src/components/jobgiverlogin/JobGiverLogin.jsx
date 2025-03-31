import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JobGiverLogin.css";
import logo from "../../assets/logo.png";
import figure from "../../assets/image.png";

const JobGiverLogin = ({ setUserType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [login,setLogin]=useEffect("");

  // useEffect(() => {
  //   if (login) {
  //     navigate("/postedjob");
  //   }
  // }, [navigate]);

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\d-$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Must be 8+ characters, include uppercase, number & special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/recruiter-api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data && data.status === "success") {
        sessionStorage.setItem("recruiter", JSON.stringify(data.recruiter));
        sessionStorage.setItem("userType", "jobGiver");
        sessionStorage.setItem("isLoggedIn", "true");
        setUserType("jobGiver");
        navigate("/postedjob");
      } else {
        setServerError(data?.message || "Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="JobPortal Logo" />
          JobPortal
        </div>
        <button className="signup-button" onClick={() => navigate("/job-giver/signup")}>
          Sign Up
        </button>
      </nav>

      <div className="login-container">
        <img src={figure} alt="3D Figure" />
        <div className="login-box">
          <h2>Job Giver Log In</h2>
          <form onSubmit={handleSubmit}>
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

            {serverError && <span className="error-message">{serverError}</span>}

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobGiverLogin;
