// src/components/AsciiArt.jsx
import React, { useRef, useEffect } from "react";
import "../style/AsciiArt.css";
import { Calendar, MapPin, Clock } from "lucide-react";

const ASCII_LARGE = `
  /$$$$$$  /$$$$$$$$ /$$$$$$$   /$$$$$$  /$$   /$$  /$$$$$$  /$$   /$$  /$$$$$$  /$$       /$$$$$$$        /$$$$$$$  /$$$$$$
 /$$__  $$|__  $$__/| $$__  $$ /$$__  $$| $$$ | $$ /$$__  $$| $$  | $$ /$$__  $$| $$      | $$__  $$      | $$__  $$|_  $$_/
| $$  \\__/   | $$   | $$  \\ $$| $$  \\ $$| $$$$| $$| $$  \\__/| $$  | $$| $$  \\ $$| $$      | $$  \\ $$      | $$  \\ $$  | $$  
|  $$$$$$    | $$   | $$$$$$$/| $$  | $$| $$ $$ $$| $$ /$$$$| $$$$$$$$| $$  | $$| $$      | $$  | $$      | $$$$$$$/  | $$  
 \\____  $$   | $$   | $$__  $$| $$  | $$| $$  $$$$| $$|_  $$| $$__  $$| $$  | $$| $$      | $$  | $$      | $$____/   | $$  
 /$$  \\ $$   | $$   | $$  \\ $$| $$  | $$| $$\\  $$$| $$  \\ $$| $$  | $$| $$  | $$| $$      | $$  | $$      | $$        | $$  
|  $$$$$$/   | $$   | $$  | $$|  $$$$$$/| $$ \\  $$|  $$$$$$/| $$  | $$|  $$$$$$/| $$$$$$$$| $$$$$$$/      | $$       /$$$$$$
 \\______/    |__/   |__/  |__/ \\______/ |__/  \\__/ \\______/ |__/  |__/ \\______/ |________/|_______/       |__/      |______/
`;

const ASCII_SMALL = `                                     /$$   /$$  /$$$$$$   /$$$$$$  /$$   /$$             /$$     /$$                                       /$$                                               /$$   /$$                 /$$    
                                    | $$  | $$ /$$__  $$ /$$__  $$| $$  /$$/            | $$    | $$                                      | $$                                              |__/  | $$                | $$    
 /$$   /$$ /$$$$$$$   /$$$$$$       | $$  | $$| $$  \\ $$| $$  \\__/| $$ /$$/   /$$$$$$  /$$$$$$  | $$$$$$$   /$$$$$$  /$$$$$$$         /$$$$$$$  /$$$$$$        /$$    /$$ /$$$$$$   /$$$$$$  /$$ /$$$$$$    /$$$$$$  /$$$$$$  
| $$  | $$| $$__  $$ |____  $$      | $$$$$$$$| $$$$$$$$| $$      | $$$$$/   |____  $$|_  $$_/  | $$__  $$ /$$__  $$| $$__  $$       /$$__  $$ /$$__  $$      |  $$  /$$//$$__  $$ /$$__  $$| $$|_  $$_/   |____  $$|_  $$_/  
| $$  | $$| $$  \\ $$  /$$$$$$$      | $$__  $$| $$__  $$| $$      | $$  $$    /$$$$$$$  | $$    | $$  \\ $$| $$  \\ $$| $$  \\ $$      | $$  | $$| $$$$$$$$       \\  $$/$$/| $$$$$$$$| $$  \\__/| $$  | $$      /$$$$$$$  | $$    
| $$  | $$| $$  | $$ /$$__  $$      | $$  | $$| $$  | $$| $$    $$| $$\\  $$  /$$__  $$  | $$ /$$| $$  | $$| $$  | $$| $$  | $$      | $$  | $$| $$_____/        \\  $$$/ | $$_____/| $$      | $$  | $$ /$$ /$$__  $$  | $$ /$$
|  $$$$$$/| $$  | $$|  $$$$$$$      | $$  | $$| $$  | $$|  $$$$$$/| $$ \\  $$|  $$$$$$$  |  $$$$/| $$  | $$|  $$$$$$/| $$  | $$      |  $$$$$$$|  $$$$$$$         \\  $/  |  $$$$$$$| $$      | $$  |  $$$$/|  $$$$$$$  |  $$$$/
 \\______/ |__/  |__/ \\_______/      |__/  |__/|__/  |__/ \\______/ |__/  \\__/ \\_______/   \\___/  |__/  |__/ \\______/ |__/  |__/       \\_______/ \\_______/          \\_/    \\_______/|__/      |__/   \\___/   \\_______/   \\___/`;

const eventDateDisplay = "20 i 21 de desembre de 2025";
const eventTimeDisplay = "De 10h00 a 10h00";
const eventPlace = "Sala de Juntes del Campus Catalunya de la URV, Tarragona";

/* Busca el font-size máximo que cabe en targetWidthPx */
function computeFontSizeToFit(text, targetWidthPx, {
  fontFamily = '"Press Start 2P", monospace',
  min = 4,
  max = 16,
  lineHeight = 0.98
} = {}) {
  const tmp = document.createElement("canvas");
  const ctx = tmp.getContext("2d");
  const lines = text.replace(/\t/g, "    ").split("\n");
  let lo = min, hi = max, best = Math.min(12, max);

  while (hi - lo > 0.2) {
    const mid = (lo + hi) / 2;
    ctx.font = `${mid}px ${fontFamily}`;
    ctx.textBaseline = "top";
    let maxW = 0;
    for (const ln of lines) {
      maxW = Math.max(maxW, ctx.measureText(ln || " ").width);
    }
    if (maxW <= targetWidthPx) {
      best = mid; lo = mid;
    } else {
      hi = mid;
    }
  }
  return { fontSize: Math.round(best * 100) / 100, lineHeight };
}

/* Dibuja texto al canvas sin reescalado CSS posterior y con glow proporcional */
function drawAsciiToCanvas(canvas, text, fontSpec) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // medir
  const t = document.createElement("canvas");
  const tctx = t.getContext("2d");
  const font = `${fontSpec.fontSize}px ${fontSpec.fontFamily}`;
  tctx.font = font;
  tctx.textBaseline = "top";
  const lines = text.replace(/\t/g, "    ").split("\n");

  let maxWidth = 0;
  for (const ln of lines) {
    maxWidth = Math.max(maxWidth, tctx.measureText(ln || " ").width);
  }

  const lineH = Math.ceil(fontSpec.fontSize * fontSpec.lineHeight);
  const cssWidth = Math.ceil(maxWidth);
  const cssHeight = Math.ceil(lines.length * lineH);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const neon = getComputedStyle(document.documentElement).getPropertyValue("--neon").trim() || "#39FF14";
  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.fillStyle = neon;

  // glow proporcional (más bajo en tamaños pequeños)
  const glow = Math.max(0, Math.round(fontSpec.fontSize * 0.55));
  ctx.shadowColor = "rgba(57,255,20,0.18)";
  ctx.shadowBlur = glow;

  // pixel snapping vertical
  let y = 0;
  for (const ln of lines) {
    ctx.fillText(ln || " ", 0, Math.round(y));
    y += lineH;
  }

  ctx.shadowBlur = 0;
}

export default function AsciiArt() {
  const largeRef = useRef(null);
  const smallRef = useRef(null);

  useEffect(() => {
    const drawAll = () => {
      // contenedor principal para calcular ancho útil real
      const container = largeRef.current?.closest(".ascii-container") || largeRef.current?.parentElement;

      let targetWidth = window.innerWidth;
      if (container) {
        const cs = getComputedStyle(container);
        const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const borderX = parseFloat(cs.borderLeftWidth || 0) + parseFloat(cs.borderRightWidth || 0);
        targetWidth = Math.max(200, container.clientWidth - padX - borderX);
      }
      const avail = Math.floor(targetWidth * 0.98);

      const smallScreen = window.innerWidth <= 420;

      const specLarge = computeFontSizeToFit(ASCII_LARGE, avail, {
        fontFamily: '"Press Start 2P", monospace',
        min: 4.5,
        max: 16,
        lineHeight: smallScreen ? 0.96 : 0.98
      });
      const specSmall = computeFontSizeToFit(ASCII_SMALL, avail, {
        fontFamily: '"Press Start 2P", monospace',
        min: 4,
        max: 12,
        lineHeight: smallScreen ? 0.96 : 0.98
      });

      drawAsciiToCanvas(largeRef.current, ASCII_LARGE, {
        fontFamily: '"Press Start 2P", monospace',
        ...specLarge
      });
      drawAsciiToCanvas(smallRef.current, ASCII_SMALL, {
        fontFamily: '"Press Start 2P", monospace',
        ...specSmall
      });
    };

    const start = () => drawAll();
    if (document.fonts?.ready) document.fonts.ready.then(start).catch(start);
    else setTimeout(start, 50);

    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(drawAll);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ascii-container">
      <div className="ascii-canvas-wrap" aria-hidden="true">
        <canvas ref={largeRef} className="ascii-canvas ascii-canvas-large" />
      </div>

      <div className="ascii-canvas-wrap" aria-hidden="true">
        <canvas ref={smallRef} className="ascii-canvas ascii-canvas-small" />
      </div>

      <div className="event-info">
        <p>
          <span className="label"><Calendar color="#39FF14" /></span> {eventDateDisplay}
        </p>
        <p>
          <span className="label"><Clock color="#39FF14" /></span> {eventTimeDisplay}
        </p>
        <p>
          <span className="label"><MapPin color="#39FF14" /></span> {eventPlace}
        </p>
      </div>
    </div>
  );
}