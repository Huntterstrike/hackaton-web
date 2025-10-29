import React, { useState, useEffect } from "react";
import MatrixBackground from "./MatrixBackground";
import PongGame from "./PongGame";
import "./App.css";

/* --- Helper para eliminar indentación común en un literal multi-linea --- */
function dedent(str) {
  const lines = str.split("\n");
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  if (!lines.length) return "";
  const indents = lines
    .filter((l) => l.trim().length)
    .map((l) => l.match(/^(\s*)/)[1].length);
  const minIndent = Math.min(...indents);
  return lines.map((l) => l.slice(minIndent)).join("\n");
}

/* --- ASCII art exacto --- */
const ASCII_LARGE = dedent(`
 /$$$$$$  /$$$$$$$$  /$$$$$$$   /$$$$$$  /$$   /$$ /$$   /$$  /$$$$$$  /$$       /$$$$$$$        /$$$$$$$  /$$$$$$
/$$__  $$|__   $$__/| $$__  $$ /$$__  $$| $$$ | $$| $$  | $$ /$$__  $$| $$      | $$__  $$      | $$__  $$|_  $$_/
| $$  \\__/   | $$   | $$  \\ $$| $$  \\ $$| $$$$| $$| $$  | $$| $$  \\ $$| $$      | $$  \\ $$      | $$  \\ $$  | $$  
|  $$$$$$    | $$   | $$$$$$$/| $$  | $$| $$ $$ $$| $$$$$$$$| $$  | $$| $$      | $$  | $$      | $$$$$$$/  | $$  
 \\____  $$   | $$   | $$__  $$| $$  | $$| $$  $$$$| $$__  $$| $$  | $$| $$      | $$  | $$      | $$____/   | $$  
 /$$  \\ $$   | $$   | $$  \\ $$| $$  | $$| $$\\  $$$| $$  | $$| $$  | $$| $$      | $$  | $$      | $$        | $$  
|  $$$$$$/   | $$   | $$  | $$|  $$$$$$/| $$ \\  $$| $$  | $$|  $$$$$$/| $$$$$$$$| $$$$$$$/      | $$       /$$$$$$
 \\______/    |__/   |__/  |__/ \\______/ |__/  \\__/|__/  |__/ \\______/ |________/|_______/       |__/      |______/
`);

const ASCII_SMALL = dedent(`
                                     /$$   /$$  /$$$$$$   /$$$$$$  /$$   /$$             /$$     /$$                                       /$$                                               /$$   /$$                 /$$    
                                    | $$  | $$ /$$__  $$ /$$__  $$| $$  /$$/            | $$    | $$                                      | $$                                              |__/  | $$                | $$    
 /$$   /$$ /$$$$$$$   /$$$$$$       | $$  | $$| $$  \\ $$| $$  \\__/| $$ /$$/   /$$$$$$  /$$$$$$  | $$$$$$$   /$$$$$$  /$$$$$$$         /$$$$$$$  /$$$$$$        /$$    /$$ /$$$$$$   /$$$$$$  /$$ /$$$$$$    /$$$$$$  /$$$$$$  
| $$  | $$| $$__  $$ |____  $$      | $$$$$$$$| $$$$$$$$| $$      | $$$$$/   |____  $$|_  $$_/  | $$__  $$ /$$__  $$| $$__  $$       /$$__  $$ /$$__  $$      |  $$  /$$//$$__  $$ /$$__  $$| $$|_  $$_/   |____  $$|_  $$_/  
| $$  | $$| $$  \\ $$  /$$$$$$$      | $$__  $$| $$__  $$| $$      | $$  $$    /$$$$$$$  | $$    | $$  \\ $$| $$  \\ $$| $$  \\ $$      | $$  | $$| $$$$$$$$       \\  $$/$$/| $$$$$$$$| $$  \\__/| $$  | $$      /$$$$$$$  | $$    
| $$  | $$| $$  | $$ /$$__  $$      | $$  | $$| $$  | $$| $$    $$| $$\\  $$  /$$__  $$  | $$ /$$| $$  | $$| $$  | $$| $$  | $$      | $$  | $$| $$_____/        \\  $$$/ | $$_____/| $$      | $$  | $$ /$$ /$$__  $$  | $$ /$$
|  $$$$$$/| $$  | $$|  $$$$$$$      | $$  | $$| $$  | $$|  $$$$$$/| $$ \\  $$|  $$$$$$$  |  $$$$/| $$  | $$|  $$$$$$/| $$  | $$      |  $$$$$$$|  $$$$$$$         \\  $/  |  $$$$$$$| $$      | $$  |  $$$$/|  $$$$$$$  |  $$$$/
 \\______/ |__/  |__/ \\_______/      |__/  |__/|__/  |__/ \\______/ |__/  \\__/ \\_______/   \\___/  |__/  |__/ \\______/ |__/  |__/       \\_______/ \\_______/          \\_/    \\_______/|__/      |__/   \\___/   \\_______/   \\___/
`);

const phases = [
  { title: "Fase 1", description: "Descripció de la fase 1." },
  { title: "Fase 2", description: "Descripció de la fase 2." },
  { title: "Fase 3", description: "Descripció de la fase 3." },
];

const targetDate = new Date("2025-12-01T00:00:00");
const eventDateDisplay = "XX i YY de desembre de 2025";
const eventPlace = "Crai Campus Catalunya, Tarragona";

function formatTimeLeft(t) {
  if (!t) return "0 dies : 0 hores : 0 minuts : 0 segons";
  const { days, hours, minutes, seconds } = t;
  const dLabel = days === 1 ? "dia" : "dies";
  const hLabel = hours === 1 ? "hora" : "hores";
  const mLabel = minutes === 1 ? "minut" : "minuts";
  const sLabel = seconds === 1 ? "segon" : "segons";
  return `${days} ${dLabel} : ${hours} ${hLabel} : ${minutes} ${mLabel} : ${seconds} ${sLabel}`;
}

function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [clickCount, setClickCount] = useState(0);
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

  const handleLogoClick = () => {
    setClickCount((c) => {
      const newCount = c + 1;
      if (newCount === 5) {
        setShowPong(true);
        return 0;
      }
      return newCount;
    });
  };

  const closePong = () => setShowPong(false);

  return (
    <MatrixBackground options={{ baseFontSize: 18, speed: 1.05 }}>
      <div className="App">
        <header className="App-header" onClick={handleLogoClick}>
          <div className="ascii-container">
            <pre className="ascii-large" aria-hidden>
              {ASCII_LARGE}
            </pre>
            <pre className="ascii-small" aria-hidden>
              {ASCII_SMALL}
            </pre>
            <div className="event-info">
              <p>
                <span className="label"></span> {eventDateDisplay}
              </p>
              <p>
                <span className="label"></span> {eventPlace}
              </p>
            </div>
          </div>
        </header>

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
        </div>

        <div className="countdown-block">
          <div className="countdown-value">{formatTimeLeft(timeLeft)}</div>
        </div>

        <section className="phases">
          {phases.map((phase, i) => (
            <div key={i} className="phase">
              <h2>{phase.title}</h2>
              <p>{phase.description}</p>
            </div>
          ))}
        </section>

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