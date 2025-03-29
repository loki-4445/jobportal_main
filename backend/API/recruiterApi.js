const express = require("express");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const recruiterApp = express.Router();

// Register a Recruiter
recruiterApp.post("/register", async (req, res) => {
  try {
    const recruitersCollection = req.app.get("recruitersCollection");
    let newRecruiter = req.body;

    // Check if recruiter already exists by email
    let existingRecruiter = await recruitersCollection.findOne({ email: newRecruiter.email });

    if (existingRecruiter) {
      return res.send({ message: "Recruiter with this email already exists", status: "failed" });
    }

    // Hash the password before storing
    const saltRounds = 10;
    newRecruiter.password = await bcrypt.hash(newRecruiter.password, saltRounds);

    // Initialize jobs as an empty array
    newRecruiter.jobs = [];

    // Insert new recruiter into database
    await recruitersCollection.insertOne(newRecruiter);

    res.send({ message: "Recruiter registered successfully", status: "success" });

  } catch (err) {
    console.error("Error registering recruiter:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

recruiterApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({ message: "Email and password are required", status: "failed" });
    }

    const recruitersCollection = req.app.get("recruitersCollection");
    const recruiter = await recruitersCollection.findOne({ email });

    if (!recruiter) {
      return res.send({ message: "Recruiter not found", status: "failed" });
    }

    // Compare the entered password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.send({ message: "Invalid email or password", status: "failed" });
    }


    
    // Generate JWT Token (for authentication)
    const token = jwt.sign({ email: recruiter.email, id: recruiter._id }, process.env.SCREAT_KEY, { expiresIn: "2h" });

    res.send({
      message: "Login successful",
      status: "success",
      token,
      recruiter: {
         email: recruiter.email,
         fullname:recruiter.name,
        password:recruiter.password,
        company:recruiter.company,
        phone:recruiter.phone,
        location:recruiter.location,
        industry:recruiter.industry,
        jobs: recruiter.jobs,
      },
    });

  } catch (err) {
    console.error("Error during login:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Get All Jobs
recruiterApp.get("/jobs", async (req, res) => {
  try {
    const recruitersCollection = req.app.get("recruitersCollection");
    const recruiters = await recruitersCollection.find({}).toArray();

    let allJobs = [];
    recruiters.forEach(recruiter => {
      recruiter.jobs.forEach(job => {
        allJobs.push({
          companyName: recruiter.companyName,
          ...job
        });
      });
    });

    res.send({ jobs: allJobs, status: "success" });

  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Get Jobs by Recruiter's Email
recruiterApp.get("/my-jobs/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.send({ message: "Email is required", status: "failed" });
    }

    const recruitersCollection = req.app.get("recruitersCollection");
    let recruiter = await recruitersCollection.findOne({ email });

    if (!recruiter) {
      return res.send({ message: "Recruiter not found", status: "failed" });
    }

    res.send({ jobs: recruiter.jobs, status: "success" });

  } catch (err) {
    console.error("Error fetching recruiter jobs:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Search Jobs by Keyword
recruiterApp.get("/jobs-by-keyword/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.send({ message: "Keyword is required", status: "failed" });
    }

    const recruitersCollection = req.app.get("recruitersCollection");
    const recruiters = await recruitersCollection.find({}).toArray();

    let matchingJobs = [];
    recruiters.forEach(recruiter => {
      if (recruiter.jobs && Array.isArray(recruiter.jobs)) {
        recruiter.jobs.forEach(job => {
          if (job.keywords.includes(keyword.toLowerCase())) {
            matchingJobs.push({
              companyName: recruiter.companyName,
              recruiterEmail: recruiter.email,
              ...job
            });
          }
        });
      }
    });

    if (matchingJobs.length === 0) {
      return res.send({ message: "No jobs found for this keyword", status: "failed" });
    }

    res.send({ jobs: matchingJobs, status: "success" });

  } catch (err) {
    console.error("Error fetching jobs by keyword:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Update Recruiter Data
recruiterApp.put("/update-recruiter", async (req, res) => {
  try {
    const { email, old_password, new_password, ...updateFields } = req.body;

    if (!email) {
      return res.send({ message: "Email is required", status: "failed" });
    }

    const recruitersCollection = req.app.get("recruitersCollection");
    const recruiter = await recruitersCollection.findOne({ email });

    if (!recruiter) {
      return res.send({ message: "Recruiter not found", status: "failed" });
    }

    // If updating password, verify the old password first
    if (new_password) {
      if (!old_password) {
        return res.send({ message: "Old password is required to change password", status: "failed" });
      }
      if (new_password === old_password) {
        return res.send({ message: "Please choose a different password", status: "failed" });
      }

      // Verify old password
      const isMatch = await bcrypt.compare(old_password, recruiter.password);
      if (!isMatch) {
        return res.send({ message: "Incorrect old password", status: "failed" });
      }

      // Hash new password
      updateFields.password = await bcrypt.hash(new_password, 7);
    }

    // Update recruiter details
    await recruitersCollection.updateOne({ email }, { $set: updateFields });

    res.send({ message: "Recruiter updated successfully", status: "success" });

  } catch (err) {
    console.error("Error updating recruiter:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});
recruiterApp.post("/register", async (req, res) => {
  try {
    const recruitersCollection = req.app.get("recruitersCollection");
    let newRecruiter = req.body;

    let existingRecruiter = await recruitersCollection.findOne({ email: newRecruiter.email });
    if (existingRecruiter) {
      return res.send({ message: "Recruiter with this email already exists", status: "failed" });
    }

    newRecruiter.jobs = [];
    await recruitersCollection.insertOne(newRecruiter);

    res.send({ message: "Recruiter registered successfully", status: "success", recruiter: newRecruiter });
  } catch (err) {
    console.error("Error registering recruiter:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Post a Job (Recruiter)
recruiterApp.post("/post-job", async (req, res) => {
  try {
    const { email, jobTitle, jobDescription, salary, mode, jobType, keywords } = req.body;

    if (!email || !jobTitle || !jobDescription || !salary || !mode || !jobType || !keywords) {
      return res.send({ message: "All fields are required", status: "failed" });
    }

    const recruitersCollection = req.app.get("recruitersCollection");
    const recruiter = await recruitersCollection.findOne({ email });
    if (!recruiter) {
      return res.send({ message: "Recruiter not found", status: "failed" });
    }

    const jobId = recruiter.jobs.length + 1;
    const keywordArray = keywords.split(",").map(kw => kw.trim().toLowerCase());

    const newJob = {
      jobId,
      jobTitle,
      jobDescription,
      salary,
      mode,
      jobType,
      keywords: keywordArray,
      postedAt: new Date(),
      applied: [] // Initialize applied array
    };

    await recruitersCollection.updateOne({ email }, { $push: { jobs: newJob } });
    res.send({ message: "Job posted successfully", status: "success", job: newJob });
  } catch (err) {
    console.error("Error posting job:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});

// Apply for a Job
recruiterApp.post("/apply-job", async (req, res) => {
  try {
    const { recruiterEmail, jobTitle, applicantEmail, applicantName, resumeUrl, applicantNumber } = req.body;

    // Validate required fields
    if (!recruiterEmail || !jobTitle || !applicantEmail || !applicantName || !resumeUrl) {
      return res.send({ message: "All fields are required", status: "failed" });
    }

    const recruitersCollection = req.app.get("recruitersCollection");

    // Find the recruiter by email
    const recruiter = await recruitersCollection.findOne({ email: recruiterEmail });
    if (!recruiter) {
      return res.send({ message: "Recruiter not found", status: "failed" });
    }

    // Find the job within the recruiter's jobs array
    let jobIndex = recruiter.jobs.findIndex(job => job.jobTitle.toLowerCase() === jobTitle.toLowerCase());
    if (jobIndex === -1) {
      return res.send({ message: "Job not found", status: "failed" });
    }

    // Check if the user has already applied for this job
    const alreadyApplied = recruiter.jobs[jobIndex].applied.some(
      applicant => applicant.applicantEmail === applicantEmail
    );

    if (alreadyApplied) {
      return res.send({ message: "Already applied", status: "failed" });
    }

    // Create the applicant object
    const applicant = { 
      applicantEmail, 
      applicantName, 
      applicantNumber,
      resumeUrl, 
      appliedAt: new Date() 
    };

    // Push the applicant to the job's applied array
    recruiter.jobs[jobIndex].applied.push(applicant);

    // Update the recruiter document in the database
    await recruitersCollection.updateOne(
      { email: recruiterEmail },
      { $set: { jobs: recruiter.jobs } }
    );

    res.send({ message: "Application submitted successfully", status: "success" });

  } catch (err) {
    console.error("Error applying for job:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});




recruiterApp.get("/top-jobs", async (req, res) => {
  try {
    const recruitersCollection = req.app.get("recruitersCollection");
    const recruiters = await recruitersCollection.find({}).toArray();

    let allJobs = [];

    recruiters.forEach(recruiter => {
      console.log("Recruiter:", recruiter.email, "Company:", recruiter.company); // Debugging log

      if (recruiter.jobs && Array.isArray(recruiter.jobs)) {
        recruiter.jobs.forEach(job => {
          allJobs.push({
            companyName: recruiter.company || "Unknown Company", // Handle undefined case
            recruiterEmail: recruiter.email,
            jobTitle: job.jobTitle,
            jobDescription: job.jobDescription,
            salary: job.salary,
            mode: job.mode,
            jobType: job.jobType,
            keywords: job.keywords,
            postedAt: job.postedAt,
            appliedCount: job.applied ? job.applied.length : 0,
            applicants: job.applied || []
          });
        });
      }
    });

    // Sort jobs by appliedCount in descending order and get top 10
    allJobs.sort((a, b) => b.appliedCount - a.appliedCount);
    const topJobs = allJobs.slice(0, 10);

    res.send({ jobs: topJobs, status: "success" });

  } catch (err) {
    console.error("Error fetching top jobs:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});


// Get All Jobs Posted by Different Recruiters

// recruiterApp.get("/jobs", async (req, res) => {
//   try {
//     const recruitersCollection = req.app.get("recruitersCollection");
//     const recruiters = await recruitersCollection.find({}).toArray();

//     let allJobs = [];

//     recruiters.forEach(recruiter => {
//       console.log("Recruiter:", recruiter.email, "Company:", recruiter.company); // Debugging log

//       if (recruiter.jobs && Array.isArray(recruiter.jobs)) {
//         recruiter.jobs.forEach(job => {
//           allJobs.push({
//             companyName: recruiter.company || "Unknown Company", // Handle undefined case
//             recruiterEmail: recruiter.email, // Include recruiter email in each job
//             jobId: job.jobId,
//             jobTitle: job.jobTitle,
//             jobDescription: job.jobDescription,
//             salary: job.salary,
//             mode: job.mode,
//             jobType: job.jobType,
//             keywords: job.keywords,
//             postedAt: job.postedAt,
//             appliedCount: job.applied ? job.applied.length : 0,
//             applicants: job.applied || []
//           });
//         });
//       }
//     });

//     res.send({ jobs: allJobs, status: "success" });

//   } catch (err) {
//     console.error("Error fetching jobs:", err);
//     res.send({ message: "Internal server error", status: "failed" });
//   }
// });


recruiterApp.get("/alljobs", async (req, res) => {
  try {
    const recruitersCollection = req.app.get("recruitersCollection");
    const recruiters = await recruitersCollection.find({}).toArray();

    let allJobs = [];

    recruiters.forEach(recruiter => {
      console.log("Recruiter:", recruiter.email, "Company:", recruiter.company); // Debugging log

      if (recruiter.jobs && Array.isArray(recruiter.jobs)) {
        recruiter.jobs.forEach(job => {
          allJobs.push({
  //          jobId, // Unique Job ID
            companyName: recruiter.company || "Unknown Company", // Handle undefined case
            recruiterEmail: recruiter.email,
            jobTitle: job.jobTitle,
            jobDescription: job.jobDescription,
            salary: job.salary,
            mode: job.mode,
            jobType: job.jobType,
            keywords: job.keywords,
            postedAt: job.postedAt,
            appliedCount: job.applied ? job.applied.length : 0,
            applicants: job.applied || []
          });
        });
      }
    });

    // Send the jobs in the order they are retrieved from the database
    res.send({ jobs: allJobs, status: "success" });

  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.send({ message: "Internal server error", status: "failed" });
  }
});



module.exports = recruiterApp;

