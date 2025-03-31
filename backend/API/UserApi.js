const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const userApp = express.Router();

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../assets/resume");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userEmail = req.body.email.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize email
    cb(null, `${userEmail}.pdf`); // Save the resume as email.pdf
  }
});

const upload = multer({ storage: storage });

// User Registration with Resume Upload
userApp.post("/register", upload.single("resume"), async (req, res) => {
  try {
    const usersCollection = req.app.get("userCollection");
    let newUser = req.body;

    // Check if user already exists
    let existingUser = await usersCollection.findOne({ email: newUser.email });

    if (existingUser) {
      return res.send({ message: "User already exists", status: "failed" });
    }

    // Hash password
    newUser.password = await bcrypt.hash(newUser.password, 7);

    // Convert skills from comma-separated string to array
    if (newUser.skills && typeof newUser.skills === "string") {
      newUser.skills = newUser.skills.split(",").map(skill => skill.trim());
    }

    // Save resume path in DB
    if (req.file) {
      newUser.resume = `/assets/resume/${req.file.filename}`;
    }

    // Insert new user into database
    await usersCollection.insertOne(newUser);

    res.send({ message: "User registered successfully", status: "success", resume: newUser.resume });

  } catch (err) {
    console.error("Error registering user:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// User Login Route
userApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({ status: "failed", message: "Email and password are required" });
    }

    const usersCollection = req.app.get("userCollection");

    // Check if user exists
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.send({ status: "failed", message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({ status: "failed", message: "Invalid email or password" });
    }

    // Add userType before sending response
    const userData = { ...user, userType: "jobSeeker" };

    res.send({ status: "success", message: "Login successful", user: userData });

  } catch (err) {
    console.error("Error logging in:", err);
    res.send({ status: "failed", message: "Internal server error" });
  }
});

  
// Download Resume
userApp.post("/download-resume", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({ message: "Email is required", status: "failed" });
    }

    const usersCollection = req.app.get("userCollection");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user || !user.resume) {
      return res.send({ message: "Resume not found", status: "failed" });
    }

    // Get the resume path
    const filePath = path.join(__dirname, "..", user.resume);

    // Check if file exists before sending
    if (!fs.existsSync(filePath)) {
      return res.send({ message: "File not found on server", status: "failed" });
    }

    // Send file for download
    res.download(filePath, `${email}_resume.pdf`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.send({ message: "Error downloading file", status: "failed" });
      }
    });

  } catch (err) {
    console.error("Error processing request:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Retrieve User Data
userApp.get("/user", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({ message: "Email is required", status: "failed" });
    }

    const usersCollection = req.app.get("userCollection");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.send({ message: "User not found", status: "failed" });
    }

    res.send({ status: "success", payload: user, message: "User data retrieved successfully" });

  } catch (err) {
    console.error("Error processing request:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Update User Data
userApp.put("/update-user", async (req, res) => {
  try {
    const { email, password, ...updateFields } = req.body;

    if (!email) {
      return res.send({ message: "Email is required", status: "failed" });
    }

    const usersCollection = req.app.get("userCollection");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.send({ message: "User not found", status: "failed" });
    }

    // If password is provided, hash it
    if (password) {
      updateFields.password = await bcrypt.hash(password, 7);
    }

    // Update user details
    await usersCollection.updateOne({ email }, { $set: updateFields });

    res.send({ message: "User updated successfully", status: "success" });

  } catch (err) {
    console.error("Error updating user:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});
// Get All Users
userApp.get("/all-users", async (req, res) => {
  try {
    const usersCollection = req.app.get("userCollection");
    
    // Fetch all users from the database
    const users = await usersCollection.find({}).toArray();

    if (!users.length) {
      return res.send({ message: "No users found", status: "failed" });
    }

    res.send({ status: "success", payload: users, message: "Users retrieved successfully" });
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});


module.exports = userApp;
