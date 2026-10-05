"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

export default function ScratchDate({ date, day }: { date: string; day: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const paint = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.scale(scale, scale);
      const gold = ctx.createLinearGradient(0, 0, width, height);
      gold.addColorStop(0, "#ad792d"); gold.addColorStop(0.45, "#f0d590"); gold.addColorStop(1, "#b88636");
      ctx.fillStyle = gold; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(74,42,13,.28)"; ctx.strokeRect(12, 12, width - 24, height - 24);
      ctx.textAlign = "center"; ctx.fillStyle = "#432711";
      ctx.font = "28px Georgia, serif"; ctx.fillText("A date to remember", width / 2, height / 2 - 6);
      ctx.font = "14px Arial, sans-serif"; ctx.fillText("Scratch here to reveal", width / 2, height / 2 + 25);
      strokes.current = 0;
    };
    paint();
    const observer = new ResizeObserver(paint); observer.observe(canvas);
    return () => observer.disconnect();
  }, [revealed]);

  const scratch = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current || revealed) return;
    const canvas = event.currentTarget;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) { setRevealed(true); return; }
    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 44; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(previous.current?.x ?? point.x, previous.current?.y ?? point.y);
    ctx.lineTo(point.x, point.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(point.x, point.y, 22, 0, Math.PI * 2); ctx.fill();
    previous.current = point;
    if (++strokes.current % 6 === 0) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < pixels.length; i += 64) { total++; if (pixels[i] < 128) clear++; }
      if (clear / total > 0.38) setRevealed(true);
    }
  };

  return (
    <section className="date-section" id="special-date" aria-labelledby="date-title">
      <p className="eyebrow">A beautiful beginning</p>
      <h2 id="date-title">Our Special Date</h2>
      <p className="date-instruction">A little surprise, just for you.</p>
      <div className={`scratch-card ${revealed ? "is-revealed" : ""}`}>
        <div className="scratch-date" aria-hidden={!revealed}><span>{day}</span><strong>{date}</strong><span>{weddingTimeLabel}</span></div>
        {!revealed && <canvas ref={canvasRef} aria-hidden="true" onPointerDown={(event) => {
          dragging.current = true; previous.current = null;
          event.currentTarget.setPointerCapture(event.pointerId); scratch(event);
        }} onPointerMove={scratch} onPointerUp={() => { dragging.current = false; previous.current = null; }} onPointerCancel={() => { dragging.current = false; previous.current = null; }} />}
      </div>
      <div className="reveal-status" aria-live="polite">{revealed ? `Save the date: ${day}, ${date}` : "Scratch the gold card with your finger, or tap below."}</div>
      {!revealed && <button className="button button-wine" onClick={() => setRevealed(true)}>Reveal our date</button>}
    </section>
  );
}
const weddingTimeLabel = "Save the date";
