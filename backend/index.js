const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");
const cors = require("cors"); // Import CORS
require("dotenv").config();

const app = express();

// Enable CORS for both local and deployed frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "https://jobportal-frontend-9x47.onrender.com"], // Allow both local and deployed frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies if needed
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Connection
const mClient = new MongoClient(process.env.DB_URL);

mClient.connect()
  .then((connectionObj) => {
    console.log("Connected to database");

    const jbdb = connectionObj.db("jobportal");

    // Collections
    const userCollection = jbdb.collection("users");
    const recruitersCollection = jbdb.collection("recruiters");

    // Store collections globally
    app.set("userCollection", userCollection);
    app.set("recruitersCollection", recruitersCollection);

    // Import API routes
    const userApi = require("./API/UserApi");
    const recruiterApi = require("./API/recruiterApi");

    // Define API Routes
    app.use("/user-api", userApi);
    app.use("/recruiter-api", recruiterApi);

    // ✅ Serve resumes correctly
    app.use("/assets/resume", express.static(path.join(__dirname, "assets/resume")));

    // Invalid Path Handler
    app.use("*", (req, res) => {
      res.status(404).send({ message: "Invalid Path" });
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });
