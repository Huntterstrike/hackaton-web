import React, { useRef, useEffect } from "react";
import "../style/MatrixBackground.css";

export default function MatrixBackground({ children, options = {} }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dropsRef = useRef([]);
  const runningRef = useRef(false);

  // Valores por defecto pensados para ser de fondo (sutiles)
  const opts = {
    baseFontSize: 14,                   // tamaño de caracteres (más pequeño)
    trailAlpha: 0.12,                   // mayor valor = trail más marcado (suaviza contraste)
    speed: 0.75,                        // más lento
    headColor: "rgba(57,255,20,0.18)",  // cabeza (ligeramente visible)
    tailColor: "rgba(57,255,20,0.06)",  // cola (muy tenue)
    charset: "0123456789コードurv",              // sólo números para estilo clásico
    ...options,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0, columns = 0, fontSize = opts.baseFontSize;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      const densityScale = width < 600 ? 0.85 : 1;
      fontSize = Math.max(10, Math.round(opts.baseFontSize * densityScale));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.floor(width / fontSize) + 1;
      const old = dropsRef.current || [];
      const next = new Array(columns);
      for (let i = 0; i < columns; i++) {
        next[i] = old[i] !== undefined ? old[i] : Math.floor(Math.random() * height / fontSize);
      }
      dropsRef.current = next;

      ctx.textBaseline = "top";
      ctx.font = `${fontSize}px monospace`;
    }

    function draw() {
      // rastro: mayor alfa para borrar rápido y suavizar el contraste
      ctx.fillStyle = `rgba(0,0,0,${opts.trailAlpha})`;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = Math.floor(dropsRef.current[i]) * fontSize;
        const char = opts.charset.charAt(Math.floor(Math.random() * opts.charset.length));

        // cabeza (más brillante pero con baja opacidad)
        ctx.fillStyle = opts.headColor;
        ctx.fillText(char, x, y);

        // cola (opacidad decreciente)
        ctx.fillStyle = opts.tailColor;
        for (let t = 1; t < 4; t++) {
          const yy = y - t * fontSize;
          if (yy >= 0) {
            ctx.globalAlpha = Math.max(0, 1 - t * 0.25);
            ctx.fillText(char, x, yy);
          }
        }
        ctx.globalAlpha = 1;

        // avance de columna (más lento y menos abrupto)
        if (dropsRef.current[i] * fontSize > height && Math.random() > 0.985) {
          dropsRef.current[i] = 0;
        } else {
          dropsRef.current[i] += (Math.random() * 0.4 + 0.6) * opts.speed;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function start() {
      if (runningRef.current) return;
      runningRef.current = true;
      resize();
      rafRef.current = requestAnimationFrame(draw);
    }

    function stop() {
      runningRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    // iniciar y listeners
    start();
    window.addEventListener("resize", resize);
    function handleVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [
    opts.baseFontSize,
    opts.trailAlpha,
    opts.speed,
    opts.headColor,
    opts.tailColor,
    opts.charset,
  ]);

  return (
    <>
      <canvas id="matrix-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="matrix-content">{children}</div>
    </>
  );
}