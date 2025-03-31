import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LandingPage from "./components/landingpage/LandingPage";
import Login from "./components/login/Login";
import JobSeekerRootLayout from "./JobSeekerRootLayout";
import JobGiverRootLayout from "./JobGiverRootLayout";
import SignUp from "./components/signup/SignUp";
import OnTrend from "./components/ontrend/OnTrend";
import Home from "./components/home/Home";
import ViewJobs from "./components/viewjobs/ViewJobs";
import Update from "./components/update/Update";
import VAC from "./components/vac/VAC";
import AddNewJob from "./components/addnewjob/AddNewJob";
import ManageCompanyProfile from "./components/managecompanyprofile/ManageCompanyProfile";
import PostedJob from "./components/postedjob/PostedJob";
import JobGiverLogin from "./components/jobgiverlogin/JobGiverLogin";
import JobGiverSignup from "./components/jobgiversignup/JobGiverSignup";
import "./App.css";

// Layout Wrapper Component
const RootLayout = ({ setUserType, userType }) => {
  if (userType === "jobSeeker") {
    return <JobSeekerRootLayout setUserType={setUserType} userType={userType} />;
  }
  if (userType === "jobGiver") {
    return <JobGiverRootLayout setUserType={setUserType} userType={userType} />;
  }
  return <LandingPage setUserType={setUserType} />;
};

function App() {
  const [userType, setUserType] = useState(() => sessionStorage.getItem("userType") || null);

  useEffect(() => {
    sessionStorage.setItem("userType", userType);
  }, [userType]);

  const router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout setUserType={setUserType} userType={userType} />, // Use the wrapper layout
      children: [
        { index: true, element: <LandingPage setUserType={setUserType} /> },
        { path: "home", element: <Home /> },
        { path: "signup", element: <SignUp /> },
        { path: "login", element: <Login setUserType={setUserType} userType={userType} /> },
        { path: "job-giver/signup", element: <JobGiverSignup /> },
        { path: "job-giver/login", element: <JobGiverLogin setUserType={setUserType} userType={userType} /> },
        { path: "ontrend", element: <OnTrend /> },
        { path: "viewjobs", element: <ViewJobs /> },
        { path: "update", element: <Update /> },
        { path: "postedjob", element: <PostedJob /> },
        { path: "managecompanyprofile", element: <ManageCompanyProfile /> },
        { path: "addnewjob", element: <AddNewJob /> },
        { path: "vac", element: <VAC /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
