import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import RootLayout from './RootLayout';
import OnTrend from './components/ontrend/OnTrend';
import Home from './components/home/Home';
import SearchBar from './components/searchbar/SearchBar';
import ViewJobs from './components/viewjobs/ViewJobs';
import Update from './components/update/Update';
import VAC from './components/vac/VAC';
import AddNewJob from './components/addnewjob/AddNewJob';
import ManageCompanyProfile from './components/managecompanyprofile/ManageCompanyProfile';
import PostedJob from './components/postedjob/PostedJob';
import JobGiverLogin from './components/jobgiverlogin/JobGiverLogin';
import JobGiverSignup from './components/jobgiversignup/JobGiverSignup';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially null to prevent flicker
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const savedUserType = localStorage.getItem('userType') || '';

    setIsLoggedIn(loggedInStatus);
    setUserType(savedUserType);
  }, []);

  // Function to handle login updates
  const handleLogin = (userType) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', userType);
    setIsLoggedIn(true);
    setUserType(userType);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType('');
  };

  // Ensure session data is loaded before rendering
  if (isLoggedIn === null) {
    return <p>Loading...</p>;
  }

  const browserRouter = createBrowserRouter([
    {
      path: '',
      element: (
        <RootLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userType={userType} />
      ),
      children: [
        {
          index: true,
          element: <LandingPage setUserType={setUserType} />,
        },
        {
          path: 'home',
          element: <Home />,
        },
        {
          path: 'signup',
          element: <SignUp />,
        },
        {
          path: 'login',
          element: <Login setIsLoggedIn={handleLogin} />,
        },
        {
          path: 'searchbar',
          element: <SearchBar />,
        },
        {
          path: 'ontrend',
          element: <OnTrend />,
        },
        {
          path: 'viewjobs',
          element: <ViewJobs />,
        },
        {
          path: 'update',
          element: <Update />,
        },
        {
          path: 'postedjob',
          element: <PostedJob />,
        },
        {
          path: 'managecompanyprofile',
          element: <ManageCompanyProfile />,
        },
        {
          path: 'addnewjob',
          element: <AddNewJob />,
        },
        {
          path: 'vac',
          element: <VAC />,
        },
        {
          path: 'job-giver/signup',
          element: <JobGiverSignup />,
        },
        {
          path: 'job-giver/login',
          element: <JobGiverLogin setIsLoggedIn={handleLogin} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
