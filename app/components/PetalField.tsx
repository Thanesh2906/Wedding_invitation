"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Falling petals + gold-dust ambience. Deterministic so server and client render the same markup. */
const PETAL_COUNT = 12;
function seededSequence(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const PETALS = (() => {
  const next = seededSequence(42);
  return Array.from({ length: PETAL_COUNT }, (_, i) => ({
    id: i,
    left: 2 + next() * 96,
    size: 12 + next() * 12,
    duration: 16 + next() * 12,
    delay: next() * 10,
    drift: (next() - 0.5) * 140,
    rotateStart: next() * 360,
    kind: i % 3 === 0 ? "dust" : "petal",
  }));
})();

export default function PetalField({ celebration = false }: { celebration?: boolean }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <div className={`petal-field ${celebration ? "petal-celebration" : ""}`} aria-hidden="true">
      {(celebration ? [...PETALS, ...PETALS] : PETALS).map((p, index) => (
        <motion.span
          key={index}
          className="petal"
          style={{ left: `${celebration ? (index * 37) % 100 : p.left}%`, width: p.size, height: p.size }}
          initial={{ y: "-10vh", x: 0, opacity: 0, rotate: p.rotateStart }}
          animate={{ y: celebration ? "90vh" : "112vh", x: [0, p.drift, 0], opacity: [0, 0.9, 0.85, 0], rotate: p.rotateStart + 220 }}
          transition={{ duration: celebration ? 3.6 : p.duration, delay: celebration ? index * 0.04 : p.delay, repeat: celebration ? 0 : Infinity, ease: "linear" }}
        >
          {p.kind === "petal" ? (
            <svg viewBox="0 0 24 24" width={p.size} height={p.size}>
              <path d="M12 2C6 8 2 14 12 22C22 14 18 8 12 2Z" fill="#e6bc64" opacity="0.85" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width={p.size * 0.55} height={p.size * 0.55}>
              <circle cx="12" cy="12" r="6" fill="#ead5a2" opacity="0.85" />
            </svg>
          )}
        </motion.span>
      ))}
    </div>
  );
}

