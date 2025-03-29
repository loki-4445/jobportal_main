import React from "react";
import "./Home.css";
import { FaSearch } from "react-icons/fa";

const Home = () => {

  return (
    <div>
      <div className="relative">
        <img
          src="https://storage.googleapis.com/a1aa/image/Ui2U-u0CJq6Awp00apsVFseYAWPAfiWcSJmlrnmKohE.jpg"
          alt="Background image of a keyboard and a hand on a laptop"
          className="background-image"
        />
        <div className="overlay">
          <h1 className="title">
            Find Nearby Jobs <span className="highlight">Sales Marketing</span>
          </h1>
          <p className="subtitle">
            It is a Long Established Fact That a Reader Will be Distracted by The Readable.
          </p>
         
          {/* Stats Section on the Image */}
          <div className="stats">
            <div className="stat">
              <i className="fas fa-briefcase stat-icon"></i>
              <h2 className="stat-number">18,955</h2>
              <p className="stat-text">Live Jobs Posted</p>
            </div>
            <div className="stat">
              <i className="fas fa-file-alt stat-icon"></i>
              <h2 className="stat-number">11,088</h2>
              <p className="stat-text">Jobs Candidate</p>
            </div>
            <div className="stat">
              <i className="fas fa-building stat-icon"></i>
              <h2 className="stat-number">10,758</h2>
              <p className="stat-text">Companies Jobs</p>
            </div>
          </div>

          <div className="trending-keywords">
            <span className="trending-title">Trending Jobs Keywords:</span>
            <span className="keyword">Web Designer</span>
            <span className="keyword">Web Developer</span>
            <span className="keyword">Graphic Designer</span>
            <span className="keyword">PHP Developer</span>
            <span className="keyword">IOS Developer</span>
            <span className="keyword">Android Developer</span>
          </div>
        </div>
      </div>

      {/* Candidate Testimonial Section */}
      <div className="home-container">
        <h2 className="section-title">What Our Candidates Say</h2>
        <p className="section-subtitle">
          Discover the voices of success! Our candidates speak for themselves about their transformative experiences.
        </p>
        <div className="testimonial-section">
          <div className="testimonial-images">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"
              alt="Candidate 1"
              className="testimonial-img img1"
            />
            <img
              src="https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=600"
              alt="Candidate 2"
              className="testimonial-img img2"
            />
            <img
              src="https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=600"
              alt="Candidate 3"
              className="testimonial-img img3"
            />
            <div className="quote-badge">
              <span className="quote-icon">❝❞</span>
              <p>25k Satisfied Clients</p>
            </div>
          </div>
          <div className="testimonial-content">
            <div className="testimonial-box">
              <p className="testimonial-text">
                Discovering this job portal has revolutionized my job search. Its user-friendly design and intuitive
                interface make navigating the platform a breeze.
              </p>
            </div>
            <div className="author-info">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQninzrUW3_CR9AjiFip05FsSp24Zp1ENqy7w&s"
                alt="User "
                className="author-img"
              />
              <div>
                <h4 className="author-name">Jonathon Smith</h4>
                <p className="author-role">Web Developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success & Award Section */}
        <div className="success-award-section">
          <button className="award-btn">Success Business Award</button>
          <br />
          <h2 className="success-title">
            <span>Our Success & Award</span>
          </h2>
          <p className="success-description">
            Lorem Ipsum is simply dummy text printing and type setting industry.
          </p>
          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-icon">📁</div>
              <h3>12,376</h3>
              <p>Live Jobs</p>
            </div>
            <div className="stat-box">
              <div className="stat-icon">👤</div>
              <h3>89,562</h3>
              <p>Jobs Candidate</p>
            </div>
            <div className="stat-box">
              <div className="stat-icon">💬</div>
              <h3>28,166</h3>
              <p>Active Resume</p>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🏢</div>
              <h3>8,966</h3>
              <p>Companies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;