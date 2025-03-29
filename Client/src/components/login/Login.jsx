import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo.png";
import figure from "../../assets/figure.png";

const Login = ({ setIsLoggedIn, setUserType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [invalid, setInvalid] = useState("");

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.removeItem("data"); // Remove user data
  }, []);

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
        const response = await fetch("http://localhost:4000/user-api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.status === "success") {
          console.log("Login Successful:", data);
          sessionStorage.setItem("data", JSON.stringify(data.user));
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userType", "jobSeeker");
          
          console.log("Stored isLoggedIn:", sessionStorage.getItem("isLoggedIn"));
          console.log("Stored userType:", sessionStorage.getItem("userType"));

          setIsLoggedIn(true);
          navigate("/home");
        } else {
          setInvalid(data.message);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        setErrors({ general: "An error occurred. Please try again later." });
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={handleBack}>Back</button>
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
