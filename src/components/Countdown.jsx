// src/components/Countdown.jsx
import React from "react";
import "../style/Countdown.css";

function pad(n) {
  return String(n ?? 0);
}

function formatParts(t) {
  // devuelve las partes por separado para renderizar <span> independientes
  if (!t) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
  const { days, hours, minutes, seconds } = t;
  return { days, hours, minutes, seconds };
}

export default function Countdown({ timeLeft }) {
  const { days, hours, minutes, seconds } = formatParts(timeLeft);

  // el contenedor tiene lang="ca" (texto original en catalán).
  // Los números llevan translate="no" para impedir que el traductor los reemplace.
  // Las etiquetas (dies/hores/...) se dejan sin translate="no" para que el traductor
  // pueda transformarlas al idioma objetivo una sola vez.
  return (
    <div className="countdown-block" lang="ca" aria-live="polite" aria-atomic="true">
      <div className="countdown-value">
        <span className="cd-part">
          <span className="cd-number" translate="no">{pad(days)}</span>{" "}
          <span className="cd-label">{days === 1 ? "dia" : "dies"}</span>
        </span>

        <span className="cd-sep"> : </span>

        <span className="cd-part">
          <span className="cd-number" translate="no">{pad(hours)}</span>{" "}
          <span className="cd-label">{hours === 1 ? "hora" : "hores"}</span>
        </span>

        <span className="cd-sep"> : </span>

        <span className="cd-part">
          <span className="cd-number" translate="no">{pad(minutes)}</span>{" "}
          <span className="cd-label">{minutes === 1 ? "minut" : "minuts"}</span>
        </span>

        <span className="cd-sep"> : </span>

        <span className="cd-part">
          <span className="cd-number" translate="no">{pad(seconds)}</span>{" "}
          <span className="cd-label">{seconds === 1 ? "segon" : "segons"}</span>
        </span>
      </div>
    </div>
  );
}