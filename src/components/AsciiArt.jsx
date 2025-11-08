// src/components/AsciiArt.jsx
import React, { useRef, useEffect } from "react";
import "../style/AsciiArt.css";

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
const eventPlace = "Sala Adjunta Campus Catalunya, Tarragona";

function drawAsciiToCanvas(canvas, text, fontSpec = { fontFamily: '"Press Start 2P", monospace', fontSize: 12, lineHeight: 1.05 }) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Establecemos font y medidas sobre un canvas temporal para medir
  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d");
  const font = `${fontSpec.fontSize}px ${fontSpec.fontFamily}`;
  tctx.font = font;
  tctx.textBaseline = "top";

  const lines = text.replace(/\t/g, "    ").split("\n");
  // medir ancho máximo en píxeles CSS
  let maxWidth = 0;
  for (const ln of lines) {
    const measure = tctx.measureText(ln || " ");
    if (measure.width > maxWidth) maxWidth = measure.width;
  }

  // dimensiones en CSS pixels
  const cssWidth = Math.ceil(maxWidth);
  const lineHeightPx = Math.ceil(fontSpec.fontSize * fontSpec.lineHeight);
  const cssHeight = Math.ceil(lines.length * lineHeightPx);

  // Ajuste para high-DPI: tamaño real del canvas en device pixels
  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  // Mostrar con tamaño CSS correcto para permitir overflow-x: auto cuando sea más ancho
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";

  // Aplicar transform para dibujar en coordenadas CSS
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  // texto y estilo
  const rootStyles = getComputedStyle(document.documentElement);
  const neon = rootStyles.getPropertyValue("--neon").trim() || "#39FF14";
  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.fillStyle = neon;

  // simular un ligero glow con shadow (opcional)
  ctx.shadowColor = "rgba(57,255,20,0.16)";
  ctx.shadowBlur = Math.max(0, Math.round(fontSpec.fontSize * 0.9));

  let y = 0;
  for (const ln of lines) {
    // dibujar la línea (si es vacía, dibujar un espacio para mantener dimensiones)
    ctx.fillText(ln || " ", 0, y);
    y += lineHeightPx;
  }

  // limpiar shadow para evitar que contamine otros dibujos (por si acaso)
  ctx.shadowBlur = 0;
}

export default function AsciiArt() {
  const largeRef = useRef(null);
  const smallRef = useRef(null);

  useEffect(() => {
    // Esperar fonts si la API está disponible, para que los textos se dibujen con la font correcta
    const doDraw = () => {
      drawAsciiToCanvas(
        largeRef.current,
        ASCII_LARGE,
        { fontFamily: '"Press Start 2P", monospace', fontSize: 12, lineHeight: 0.98 }
      );
      drawAsciiToCanvas(
        smallRef.current,
        ASCII_SMALL,
        { fontFamily: '"Press Start 2P", monospace', fontSize: 7, lineHeight: 0.98 }
      );
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(doDraw).catch(doDraw);
    } else {
      // Fallback si no existe la API de Font Loading
      setTimeout(doDraw, 50);
    }

    // Redibujar al redimensionar
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        doDraw();
      });
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
          <span className="label"></span> {eventDateDisplay}
        </p>
        <p>
          <span className="label"></span> {eventPlace}
        </p>
      </div>
    </div>
  );
}