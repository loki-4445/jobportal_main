import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import questionImage from '../../assets/landing-image.png'; // Ensure correct path

const LandingPage = ({ setUserType }) => {
  const navigate = useNavigate();
  const [userType, setUserTypeState] = useState(() => sessionStorage.getItem("userType") || null);

  useEffect(() => {
    if (userType === 'jobSeeker') {
      navigate('/login');  // Navigate to Job Seeker login
    } else if (userType === 'jobGiver') {
      navigate('/job-giver/login');  // Navigate to Job Giver login
    }
  }, [userType, navigate]);

  const handleJobSeekerClick = () => {
    sessionStorage.setItem('userType', 'jobSeeker');
    setUserType('jobSeeker');
    setUserTypeState('jobSeeker');
  };

  const handleJobGiverClick = () => {
    sessionStorage.setItem('userType', 'jobGiver');
    setUserType('jobGiver');
    setUserTypeState('jobGiver');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-image">
          <img src={questionImage} alt="Question Mark" />
        </div>
        <div className="landing-buttons">
          <button onClick={handleJobSeekerClick} className="landing-btn">
            Job Seeker
          </button>
          <button onClick={handleJobGiverClick} className="landing-btn">
            Job Giver
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
