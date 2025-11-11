// src/components/EasterEggButton.jsx
import React from "react";
import "../App.css";

export default function MasInfo() {
  return (
    <div className="MasInfo" style={{textAlign: "center"}}>
      <h2>
        Tota la informació {" "}
        <a href="https://proyectocybermes.org/hackathon25" 
           target="_blank"
           rel="noopener noreferrer"
           style={{ color: "var(--neon)", textDecoration: "underline" }}>aquí</a>        
        {" "} i a {" "}
        <a
          href="https://www.instagram.com/codeurv/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--neon)", textDecoration: "underline" }}
        >
          @Codeurv
        </a>{" "}
        a Instagram
      </h2>
    </div>
  );
}