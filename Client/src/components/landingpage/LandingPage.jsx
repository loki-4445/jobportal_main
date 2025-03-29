import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import questionImage from '../../assets/landing-image .png'; // adjust path based on your folder

const LandingPage = ({ setUserType }) => {
  const navigate = useNavigate();

  const handleJobSeekerClick = () => {
    setUserType("jobSeeker");
    navigate('/login'); // Navigate to Job Seeker login page
  };

  const handleJobGiverClick = () => {
    setUserType("jobGiver");
    navigate('/job-giver/signup'); // Navigate to Job Giver Signup page instead of login
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
