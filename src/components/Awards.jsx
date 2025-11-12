// src/components/Awards.jsx
import React from "react";
import "../style/Awards.css";

export default function Awards({
  title = "Premis en metàlic!!",
  first = "1200 €",
  second = "600 €",
  third = "TERCER PREMIO AQUI",
}) {
  const data = [
    { place: "1º", text: first, tone: "gold" },
    { place: "2º", text: second, tone: "silver" },
  ];

  return (
    <section className="awards-simple" aria-labelledby="awards-simple-title">
      <h3 id="awards-simple-title" className="awards-simple__title">{title}</h3>

      <div className="awards-simple__row">
        {data.map((d, i) => (
          <div key={i} className={`award-tile award-tile--${d.tone}`}>
            <div className="award-tile__place">{d.place}</div>
            <div className="award-tile__text">{d.text} <span>per equip</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}