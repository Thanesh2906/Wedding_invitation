"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import wedding from "../data/wedding.json";

type Countdown = { days: number; hours: number; minutes: number; seconds: number; started: boolean };
type EventKey = "wedding" | "reception";

const initialCountdown: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, started: false };
const viewport = { once: true, amount: 0.16 };

function calculateCountdown(): Countdown {
  const distance = new Date(wedding.events.wedding.isoStart).getTime() - Date.now();
  if (distance <= 0) return { ...initialCountdown, started: true };
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    started: false,
  };
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MotionButton({ children, className, href, external = false, download = false }: { children: ReactNode; className: string; href: string; external?: boolean; download?: boolean }) {
  return (
    <motion.a
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      download={download || undefined}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {children}
    </motion.a>
  );
}

function CalendarActions({ eventKey }: { eventKey: EventKey }) {
  const event = wedding.events[eventKey];
  return (
    <div className="action-row">
      <MotionButton className="button button-gold" href={event.googleCalendarUrl} external>Add to Google Calendar</MotionButton>
      <MotionButton className="button button-ghost" href={event.icsFile} download>Download 3-day reminder</MotionButton>
    </div>
  );
}

function EventCard({ eventKey, index }: { eventKey: EventKey; index: number }) {
  const event = wedding.events[eventKey];
  const isWedding = eventKey === "wedding";
  return (
    <motion.article
      className={`event-card ${isWedding ? "event-card-wine" : "event-card-ivory"}`}
      id={event.sectionId}
      initial={{ opacity: 0, y: 45, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7 }}
    >
      <motion.div className="event-number" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 0.06, x: 0 }} viewport={viewport}>0{isWedding ? "1" : "2"}</motion.div>
      <p className="eyebrow">{event.kicker}</p>
      <h2>{event.heading}</h2>
      {event.subheading && <p className="event-subheading">{event.subheading}</p>}
      <motion.div className="gold-rule" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={viewport} transition={{ duration: 0.7, delay: 0.2 }} />
      <p className="event-date">{event.displayDate}</p>
      <p className="event-time">{event.displayTime}</p>
      <p className="venue">{event.venue}</p>
      <p className="address">{event.addressLines.map((line) => <span key={line}>{line}<br /></span>)}</p>
      {event.afterText && <p className="after-text">{event.afterText}</p>}
      <MotionButton className={`button ${isWedding ? "button-light" : "button-wine"}`} href={event.mapsUrl} external>Get directions <span aria-hidden="true">↗</span></MotionButton>
      <CalendarActions eventKey={eventKey} />
    </motion.article>
  );
}

function CountdownNumber({ value }: { value: number }) {
  const display = String(value).padStart(2, "0");
  return (
    <span className="countdown-number-window">
      <motion.strong
        key={display}
        initial={{ y: -12, opacity: 0, filter: "blur(3px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {display}
      </motion.strong>
    </span>
  );
}

export default function Home() {
  const [countdown, setCountdown] = useState(initialCountdown);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setCountdown(calculateCountdown());
    const timer = window.setInterval(() => setCountdown(calculateCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <motion.nav className="floating-nav" aria-label="Invitation navigation" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
        {[["Invitation", "#invitation"], ["Wedding", "#wedding"], ["Dinner", "#reception"], ["Contact", "#contact"]].map(([label, href]) => (
          <motion.a key={label} href={href} whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }}>{label}</motion.a>
        ))}
      </motion.nav>

      <header className="hero" id="top">
        <motion.div className="hero-glow hero-glow-one" animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="hero-glow hero-glow-two" animate={reduceMotion ? undefined : { x: [0, -22, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="ornament ornament-top" initial={{ opacity: 0, scale: 0, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.25, duration: 1 }}>✦</motion.div>
        <motion.p className="hero-kicker" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}>Together with their families</motion.p>
        <motion.div className="monogram" aria-hidden="true" initial={{ opacity: 0, scale: 0.65, rotate: -18 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ type: "spring", stiffness: 150, damping: 13, delay: 0.65 }}>T<span>&</span>B</motion.div>
        <motion.h1 initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.8 } } }}>
          <motion.span variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}>{wedding.couple.groom}</motion.span>
          <motion.em variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1, transition: { duration: 0.55 } } }}>&</motion.em>
          <motion.span variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}>{wedding.couple.bride}</motion.span>
        </motion.h1>
        <motion.p className="hero-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45, duration: 0.8 }}>{wedding.events.wedding.shortDate}</motion.p>
        <motion.p className="hero-venue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}>{wedding.events.wedding.venue} · Johor Bahru</motion.p>
        <motion.a href="#invitation" className="scroll-cue" aria-label="Read the invitation" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1.9 }} whileHover={{ opacity: 1 }}><span>Discover our story</span><motion.i animate={reduceMotion ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>↓</motion.i></motion.a>
      </header>

      <section className="invitation paper-section" id="invitation">
        <motion.div className="paper-frame" initial={{ opacity: 0, y: 40, rotateX: 5 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={viewport} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <p className="eyebrow">With joyful hearts</p>
          <div className="family-intro"><p>{wedding.families.groom.parents[0]}<br />{wedding.families.groom.parents[1]}</p><span>&</span><p>{wedding.families.bride.parents[0]}<br />{wedding.families.bride.parents[1]}</p></div>
          <p className="invitation-copy">cordially request your esteemed presence<br />to witness and bless our beloved children</p>
          <motion.div className="couple-lockup" initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ duration: 0.8, delay: 0.18 }}><strong>{wedding.couple.groom}</strong><em>weds</em><strong>{wedding.couple.bride}</strong></motion.div>
          <p className="formal-copy">On Sunday, 15th of November 2026,<br />from 7:30pm to 9:00pm,<br />at Monet Garden By Diva,<br />No. 11, Jalan Bistari 12,<br />Taman Industri Jaya,<br />81300 Johor Bahru, Johor.<br /><i>and followed by dinner thereafter.</i></p>
        </motion.div>
      </section>

      <motion.section className="countdown-section" aria-label="Wedding countdown" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport} transition={{ duration: 0.8 }}>
        <p className="eyebrow">Counting every beautiful moment</p>
        <h2>{countdown.started ? "The celebration has begun" : "Until we say ‘I do’"}</h2>
        {!countdown.started && <motion.div className="countdown-grid" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ delay: 0.2, duration: 0.7 }}>{(["days", "hours", "minutes", "seconds"] as const).map((unit) => <div className="countdown-cell" key={unit}><CountdownNumber value={countdown[unit]} /><span>{unit}</span></div>)}</motion.div>}
      </motion.section>

      <section className="events-section">
        <Reveal className="section-heading"><p className="eyebrow">Save the dates</p><h2>Our Celebrations</h2><p>Two evenings, one beautiful beginning.</p></Reveal>
        <div className="events-grid"><EventCard eventKey="wedding" index={0} /><EventCard eventKey="reception" index={1} /></div>
      </section>

      <Reveal className="quick-links"><p className="eyebrow">Choose your destination</p><div aria-label="Event navigation"><MotionButton className="" href="#wedding">Wedding</MotionButton><MotionButton className="" href="#reception">Dinner</MotionButton></div></Reveal>

      <section className="families-section">
        <Reveal className="section-heading"><p className="eyebrow">With blessings from</p><h2>Our Families</h2></Reveal>
        <div className="family-grid">{(["groom", "bride"] as const).map((side, index) => <motion.article className="family-card" key={side} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.7, delay: index * 0.12 }} whileHover={{ y: -5 }}><p className="eyebrow">{side === "groom" ? "Groom’s family" : "Bride’s family"}</p><h3>{wedding.families[side].parents[0]}<br />{wedding.families[side].parents[1]}</h3><address>{wedding.families[side].addressLines.map((line) => <span key={line}>{line}<br /></span>)}</address></motion.article>)}</div>
      </section>

      <section className="contact-section" id="contact">
        <Reveal className="section-heading"><p className="eyebrow">We would love to hear from you</p><h2>Contact Details</h2></Reveal>
        <div className="contact-grid">{(["groomSide", "brideSide"] as const).map((side, index) => <motion.div className="contact-card" key={side} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ delay: index * 0.12 }} whileHover={{ borderColor: "rgba(234,213,162,.65)" }}><p>{side === "groomSide" ? "Groom side" : "Bride side"}</p>{wedding.contacts[side].map((phone) => <motion.a className="phone" href={`tel:${phone.replace(/\s/g, "")}`} key={phone} whileHover={{ scale: 1.04 }}>{phone}</motion.a>)}<MotionButton className="button button-wine" href={`tel:${wedding.contacts[side][0].replace(/\s/g, "")}`}>Call {side === "groomSide" ? "groom’s" : "bride’s"} side</MotionButton></motion.div>)}</div>
      </section>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport} transition={{ duration: 0.8 }}>
        <motion.div className="monogram monogram-small" whileInView={{ rotate: [-3, 5, -3], scale: [1, 1.08, 1] }} viewport={viewport} transition={{ duration: 1.3 }}>T<span>&</span>B</motion.div>
        <h2>Thaneshvaran <em>&</em> Banu</h2><p>15 · 11 · 2026</p><p className="footer-note">Your presence is the greatest gift of all.</p>
      </motion.footer>
    </main>
  );
}
