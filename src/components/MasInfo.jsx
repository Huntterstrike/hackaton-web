// src/components/EasterEggButton.jsx
import React from "react";
import "../App.css";

export default function MasInfo() {
  return (
    <div className="MasInfo">
      <h2>
        Més info a{" "}
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