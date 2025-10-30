// src/components/Countdown.jsx
import React from "react";
import "../style/Countdown.css";

function formatTimeLeft(t) {
  if (!t) return "0 dies : 0 hores : 0 minuts : 0 segons";
  const { days, hours, minutes, seconds } = t;
  const dLabel = days === 1 ? "dia" : "dies";
  const hLabel = hours === 1 ? "hora" : "hores";
  const mLabel = minutes === 1 ? "minut" : "minuts";
  const sLabel = seconds === 1 ? "segon" : "segons";
  return `${days} ${dLabel} : ${hours} ${hLabel} : ${minutes} ${mLabel} : ${seconds} ${sLabel}`;
}

export default function Countdown({ timeLeft }) {
  return (
    <div className="countdown-block">
      <div className="countdown-value">{formatTimeLeft(timeLeft)}</div>
    </div>
  );
}