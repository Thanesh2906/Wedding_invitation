"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import wedding from "../data/wedding.json";
import PetalField from "./components/PetalField";
import ScratchDate from "./components/ScratchDate";
import ParallaxImage from "./components/ParallaxImage";
import GoogleCalendarButton from "./components/GoogleCalendarButton";
import MemoriesSlideshow from "./components/MemoriesSlideshow";
import CalendarPrompt, { APPLE_CALENDAR_URL } from "./components/CalendarPrompt";

import { calculateCountdown, initialCountdown } from "./lib/countdown";
type EventKey = "wedding" | "reception";
const viewport = { once: true, amount: 0.16 };
// Temporarily disabled; restore the section and navigation by setting this to true.
const RSVP_ENABLED = false;

function toWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("0") ? `60${digits.slice(1)}` : digits;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
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
      <GoogleCalendarButton eventKeys={[eventKey]} />
      <MotionButton className="button button-ghost" href={event.icsFile} download>Download Calendar</MotionButton>
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
      initial={{ opacity: 0, y: 65, scale: 0.94, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={viewport}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7 }}
    >
      <motion.div className="event-number" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 0.06, x: 0 }} viewport={viewport}>0{isWedding ? "1" : "2"}</motion.div>
      <img className="event-image" src={isWedding ? "/images/wedding-location.webp" : "/images/reception-hall.webp"} alt={isWedding ? "Floral wedding hall with decorated dining tables" : "Wedding reception hall with blush draping, floral stage, and dining tables"} loading="lazy" />
      <div className="event-title-group"><p className="eyebrow">{event.kicker}</p>
      <h2>{event.heading}</h2>
      {event.subheading && <p className="event-subheading">{event.subheading}</p>}</div>
      <motion.div className="gold-rule" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={viewport} transition={{ duration: 0.7, delay: 0.2 }} />
      <p className="event-date">{event.displayDate}</p>
      <p className="event-time">{event.displayTime}</p>
      <p className="venue">{event.venue}</p>
      <p className="address">{event.addressLines.map((line) => <span key={line}>{line}<br /></span>)}</p>
      {event.afterText && <p className="after-text">{event.afterText}</p>}
      <div className="event-actions"><MotionButton className={`button ${isWedding ? "button-light" : "button-wine"}`} href={event.mapsUrl} external>View Location</MotionButton>
      <CalendarActions eventKey={eventKey} /></div>
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

function GalleryFrame({ src, alt, index }: { src: string; alt: string; index: number }) {
  const [errored, setErrored] = useState(false);
  return (
    <motion.figure
      className="gallery-frame"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      {!errored ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setErrored(true)} />
      ) : (
        <div className="gallery-placeholder" aria-hidden="true">
          <span>{wedding.couple.groom[0]}<i>&</i>{wedding.couple.bride[0]}</span>
        </div>
      )}
    </motion.figure>
  );
}

function CornerFlourish({ side }: { side: "left" | "right" }) {
  return (
    <svg className={`corner-flourish corner-flourish-${side}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="M6 6C30 10 40 24 38 44C48 34 66 34 78 46C72 30 80 14 100 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="38" cy="44" r="3.5" fill="currentColor" />
      <circle cx="78" cy="46" r="2.5" fill="currentColor" />
      <circle cx="14" cy="16" r="2" fill="currentColor" />
      <circle cx="94" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const tryPlay = () => { if (audio.paused) audio.play().catch(() => setPlaying(false)); };
    const playOnFirstInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".music-toggle")) return;
      tryPlay();
      window.removeEventListener("pointerdown", playOnFirstInteraction);
      window.removeEventListener("keydown", playOnFirstInteraction);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onPause);
    // Browsers may reject audible autoplay; the first visitor gesture can unlock it.
    tryPlay();
    window.addEventListener("pointerdown", playOnFirstInteraction);
    window.addEventListener("keydown", playOnFirstInteraction);
    window.addEventListener("invitation-opened", tryPlay);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onPause);
      window.removeEventListener("pointerdown", playOnFirstInteraction);
      window.removeEventListener("keydown", playOnFirstInteraction);
      window.removeEventListener("invitation-opened", tryPlay);
    };
  }, []);
  return (
    <>
      <audio ref={audioRef} src={wedding.music.src} loop preload="auto" />
      <motion.button type="button" className="music-toggle" aria-label={playing ? "Pause background music" : "Play background music"} aria-pressed={playing} onClick={() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => setPlaying(false)); else audio.pause();
      }} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
        <motion.span className="music-disc" animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={playing ? { duration: 6, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}>♪</motion.span>
      </motion.button>
    </>
  );
}

export default function Home() {
  const [countdown, setCountdown] = useState(initialCountdown);
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [calendarPromptDismissed, setCalendarPromptDismissed] = useState(false);
  const [reachedInvitationEnd, setReachedInvitationEnd] = useState(false);
  const invitationEndRef = useRef<HTMLDivElement>(null);
  const invitationRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setCountdown(calculateCountdown(wedding.events.wedding.isoStart));
    const timer = window.setInterval(() => setCountdown(calculateCountdown(wedding.events.wedding.isoStart)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (!opened) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [opened]);

  useEffect(() => {
    if (!opened || calendarPromptDismissed || reachedInvitationEnd) return;
    const marker = invitationEndRef.current;
    if (!marker) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReachedInvitationEnd(true);
        observer.disconnect();
      }
    }, { threshold: 1 });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [opened, calendarPromptDismissed, reachedInvitationEnd]);

  return (
    <MotionConfig reducedMotion="user">
    <main>
      {opened && reachedInvitationEnd && !calendarPromptDismissed && <CalendarPrompt onDismiss={() => setCalendarPromptDismissed(true)} />}
      {!opened && <motion.section className={`entrance ${opening ? "entrance-opening" : ""}`} aria-labelledby="welcome-title"
        initial={false} animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, delay: opening && !reduceMotion ? 2.05 : 0 }}
        onAnimationComplete={() => {
          if (!opening) return;
          setOpened(true);
          requestAnimationFrame(() => { if (!document.querySelector("dialog[open]")) invitationRef.current?.focus({ preventScroll: true }); });
        }}>
        <div className="entrance-doors" aria-hidden="true">
          <div className="entrance-door entrance-door-left"><img src="/images/entrance-sunset-door.webp" alt="" fetchPriority="high" /></div>
          <div className="entrance-door entrance-door-right"><img src="/images/entrance-sunset-door.webp" alt="" fetchPriority="high" /></div>
        </div>
        <div className="entrance-shade" />
        <motion.div className="entrance-frame" initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: opening ? 0 : 1, y: opening ? -20 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}>
          <p className="entrance-prelude">With all our hearts</p>
          <h1 id="welcome-title"><span>You are</span><em>invited</em></h1>
          <p className="entrance-invitation-line">to celebrate with us</p>
          <button disabled={opening} className="button button-gold open-invitation" onClick={() => {
            window.scrollTo({ top: 0, behavior: "instant" });
            setOpening(true);
            window.dispatchEvent(new Event("invitation-opened"));
            if (reduceMotion) {
              setOpened(true);
              requestAnimationFrame(() => { if (!document.querySelector("dialog[open]")) invitationRef.current?.focus({ preventScroll: true }); });
            }
          }}>{opening ? "Opening…" : "Open Invitation"}</button>
        </motion.div>
      </motion.section>}
      <div ref={invitationRef} inert={!opened} tabIndex={-1} className={`invitation-content ${opening || opened ? "invitation-active" : ""}`}>

      <MusicToggle />
      {opened && <PetalField />}

      <motion.nav className={`floating-nav ${opened ? "nav-opened" : ""}`} aria-label="Invitation navigation" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
        {[["Invitation", "#top"], ["Date", "#special-date"], ["Events", "#wedding"], ["RSVP", "#contact"]].filter(([, href]) => RSVP_ENABLED || href !== "#contact").map(([label, href]) => (
          <motion.a key={label} href={href} whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }}>{label}</motion.a>
        ))}
      </motion.nav>

      <header key={opening ? "revealed" : "waiting"} className="hero" id="top">
        <ParallaxImage className="hero-floral" src="/images/temple-opening.webp" />
        <div className="hero-copy">
        <motion.div className="hero-glow hero-glow-one" animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="hero-glow hero-glow-two" animate={reduceMotion ? undefined : { x: [0, -22, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <CornerFlourish side="left" />
        <CornerFlourish side="right" />
        <div className="hero-floral-frame" aria-hidden="true" />
        <motion.p className="hero-family-heading" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}>Together with our families</motion.p>
        <motion.p className="hero-invite-copy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}>We Joyfully Invite You To Celebrate<br />The Wedding And <em>Reception</em> Of</motion.p>
        <motion.h2 initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.8 } } }}>
          <motion.span className="hero-person" variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}><strong>{wedding.couple.groom}</strong><small>S/o Mr. Subramaniam &amp; Madam UmaDevi</small></motion.span>
          <motion.em className="hero-ampersand" variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1, transition: { duration: 0.55 } } }}>&amp;</motion.em>
          <motion.span className="hero-person" variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}><strong>{wedding.couple.bride}</strong><small>D/o Late Mr Jeyendran PJM PJK &amp; Madam Selvy</small></motion.span>
        </motion.h2>
        <motion.a href="#special-date" className="scroll-cue" aria-label="Scroll down to see our special date" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1.9 }} whileHover={{ opacity: 1 }}><motion.i animate={reduceMotion ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>↓</motion.i><span>Scroll down</span></motion.a>
        </div>
      </header>



      <ScratchDate date={wedding.events.wedding.shortDate} day={new Intl.DateTimeFormat("en", { weekday: "long", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(wedding.events.wedding.isoStart))} />

      <section className="events-section">
        <Reveal className="section-heading"><p className="eyebrow">Save the dates</p><h2>Wedding Timeline</h2><p>Two celebrations. One beautiful beginning.</p></Reveal>

        <div className="events-grid"><EventCard eventKey="wedding" index={0} /><EventCard eventKey="reception" index={1} /></div>
        <div className="calendar-save-all"><GoogleCalendarButton eventKeys={["wedding", "reception"]} combined /><a className="calendar-download-all" href={APPLE_CALENDAR_URL}>Add both dates to Apple Calendar</a><br /><a className="calendar-download-all" href="/calendar/thaneshvaran-banu-celebrations.ics" download>Download both dates for your calendar</a></div>
      </section>

      <motion.section className="countdown-section" id="countdown" aria-label="Wedding countdown" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport} transition={{ duration: 0.8 }}>
        <ParallaxImage className="countdown-backdrop" src="/images/countdown-wedding.webp" />
        <p className="eyebrow">Our special day is almost here…</p>
        <h2>{countdown.started ? "The celebration has begun" : "Counting down to forever"}</h2>
        {!countdown.started && <motion.div className="countdown-grid" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ delay: 0.2, duration: 0.7 }}>{(["days", "hours", "minutes", "seconds"] as const).map((unit) => <div className="countdown-cell" key={unit}><CountdownNumber value={countdown[unit]} /><span>{unit}</span></div>)}</motion.div>}
      </motion.section>


      {wedding.gallery.enabled && <section className="gallery-section" id={wedding.gallery.sectionId}>
        <Reveal className="section-heading"><p className="eyebrow">{wedding.gallery.kicker}</p><h2>{wedding.gallery.heading}</h2><p>{wedding.gallery.subheading}</p></Reveal>
        <div className="gallery-grid">{wedding.gallery.photos.map((photo, index) => <GalleryFrame key={photo.src} src={photo.src} alt={photo.alt} index={index} />)}</div>
      </section>}

      <MemoriesSlideshow />

      {RSVP_ENABLED && <section className="contact-section" id="contact">
        <Reveal className="section-heading"><p className="eyebrow">We would love to hear from you</p><h2>RSVP &amp; Contact</h2></Reveal>
        <div className="contact-grid">{(["groomSide", "brideSide"] as const).map((side, index) => {
          const sideLabel = side === "groomSide" ? "groom’s" : "bride’s";
          const firstPhone = wedding.contacts[side][0];
          return (
            <motion.div className="contact-card" key={side} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ delay: index * 0.12 }} whileHover={{ borderColor: "rgba(234,213,162,.65)" }}>
              <p>{side === "groomSide" ? "Groom’s Family" : "Bride’s Family"}</p>
              {wedding.contacts[side].map((phone) => <motion.a className="phone" href={`tel:${phone.replace(/\s/g, "")}`} key={phone} whileHover={{ scale: 1.04 }}><span aria-hidden="true">☎</span><span>{phone}</span></motion.a>)}
              <div className="contact-actions">
                <MotionButton className="button button-gold" href={toWhatsAppLink(firstPhone, `Hi! We're delighted to celebrate with ${wedding.couple.groom} & ${wedding.couple.bride} — RSVPing here on the ${sideLabel} side.`)} external>WhatsApp RSVP</MotionButton>
                <MotionButton className="button button-ghost" href={`tel:${firstPhone.replace(/\s/g, "")}`}>Call {sideLabel} side</MotionButton>
              </div>
            </motion.div>
          );
        })}</div>
      </section>}

      <footer className="invitation-closing">
        <p>Your presence is the greatest gift we could ask for.</p>
        <p>We look forward to celebrating this beautiful occasion with you.</p>
        <p className="closing-love">With love,</p>
        <h2>Thaneshvaran <em>&</em> Banu</h2>
      </footer>
      <div ref={invitationEndRef} aria-hidden="true" style={{ height: 1, width: "100%" }} />
      </div>
    </main>
    </MotionConfig>
  );
}
