import './ExploreSkeleton.css'
import revolvingEarth from "../../assets/earth-revolve.gif"
import { useState } from 'react';

function ExploreSkeleton() {
    
    const [hideLoader, setHideLoader] = useState(false);

    return (
    <div className={`loading-screen ${hideLoader ? "hide" : ""}`}>

    <div className="stars stars-back"></div>
    <div className="stars stars-middle"></div>
    <div className="stars stars-front"></div>

      <div className="gradient-overlay"></div>

      <div className="earth-glow"></div>

    <div className="earth-wrapper">
      <img
        src={revolvingEarth}
        alt="Earth"
        className="loading-earth"
      />
    </div>

      <div className="loading-content">
        <h1>Nomia</h1>

        <p>
          Exploring Humanity's Heritage
        </p>

        <div className="loading-line">
          <div className="loading-line-fill"></div>
        </div>
      </div>

    </div>
  );
    

}

export default ExploreSkeleton;