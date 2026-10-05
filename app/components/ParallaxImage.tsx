"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
export default function ParallaxImage({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-32, 32]);
  return <motion.img ref={ref} src={src} alt="" className={className} loading="lazy" style={{ y: reduced ? 0 : y, scale: reduced ? 1 : 1.12 }} />;
}
