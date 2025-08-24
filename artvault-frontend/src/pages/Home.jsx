import React from 'react';
import { Link } from 'react-router-dom';
import journeyVideo from '../assets/videos/Art_Journey_Video_Generation.mp4';

const Home = () => {
  return (
    <div className="hero-section">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src={journeyVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay">
        <div className="hero-content">
          {/* Empty as per previous request */}
        </div>
      </div>
    </div>
  );
};

export default Home;
