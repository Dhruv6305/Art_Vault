import React, { useState, useEffect } from "react";
import journeyVideo from "../assets/Videos/Art_Journey_Video_Generation.mp4";
import loopingVideo from "../assets/Videos/Art_Vault_Looping_Video_Creation.mp4";

const Home = () => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    console.log("🎬 Video source path:", journeyVideo);
  }, []);

  const handleVideoError = (e) => {
    console.error("❌ Video error:", e);
    console.error("❌ Video error details:", e.target.error);
    setVideoError(true);
  };

  const handleVideoLoaded = () => {
    console.log("✅ Video loaded successfully");
    setVideoLoaded(true);
  };

  const handleVideoCanPlay = () => {
    console.log("✅ Video can play");
  };

  return (
    <div className="hero-section">
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
          onLoadedData={handleVideoLoaded}
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
          onLoadStart={() => console.log("🔄 Video loading started")}
        >
          <source src={journeyVideo} type="video/mp4" />
          <source src={loopingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Welcome to ArtVault</h1>
          <p>Discover, collect, and trade extraordinary digital art</p>
          {videoError && (
            <div className="video-fallback">
              <p
                style={{ fontSize: "0.9rem", opacity: 0.7, marginTop: "1rem" }}
              >
                Background video unavailable - Check console for details
              </p>
            </div>
          )}
          {!videoLoaded && !videoError && (
            <div
              style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "1rem" }}
            >
              Loading video...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
