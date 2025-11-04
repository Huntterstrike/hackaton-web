// src/components/EasterEggButton.jsx
import React from "react";
import "../style/InscribeButton.css";

export default function EasterEggButton() {
  return (
    <div className="button-wrap">
      <button
        className="inscribe-button"
        onClick={() =>
          window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSfDplaceholder/viewform",
            "_blank"
          )
        }
      >
        Apunta't!
      </button>
      <p className="FechaInscripciones"> Fins al 6 de Desembre</p>
    </div>

  );
}