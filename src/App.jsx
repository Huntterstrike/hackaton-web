// src/App.jsx
import React, { useState, useEffect } from "react";
import MatrixBackground from "./components/MatrixBackground";
import PongGame from "./components/PongGame";
import AsciiArt from "./components/AsciiArt";
import Countdown from "./components/Countdown";
import Phases from "./components/Phases";
import EasterEggButton from "./components/InscribeButton";
import MasInfo from "./components/MasInfo";
import "./App.css";
import Awards from "./components/Awards";
import Footer from "./components/Footer";

const targetDate = new Date("2025-12-20T10:00:00");

function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [, setX] = useState(0);
  const [showPong, setShowPong] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setX((v) => {
      const y = v + 1;
      if (y === 5) {
        setShowPong(true);
        return 0;
      }
      return y;
    });
  };

  const closePong = () => setShowPong(false);

  return (
    <MatrixBackground options={{ baseFontSize: 18, speed: 1.05 }}>
      <div className="App">
        <header className="App-header" onClick={handleClick} style={{ position: "relative" }}>
          <AsciiArt />
        </header>

        <EasterEggButton />

        <Countdown timeLeft={timeLeft} />

        <Phases />
        <Awards />

        <MasInfo />
        <Footer />

        {showPong && (
          <div className="modal-overlay" onClick={closePong}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <PongGame onClose={closePong} />
            </div>
          </div>
        )}
      </div>
    </MatrixBackground>
  );
}

export default App;