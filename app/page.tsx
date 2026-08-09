"use client";

import { useEffect, useState } from "react";
import wedding from "../data/wedding.json";

type Countdown = { days: number; hours: number; minutes: number; seconds: number; started: boolean };

const initialCountdown: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, started: false };

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

function CalendarActions({ eventKey }: { eventKey: "wedding" | "reception" }) {
  const event = wedding.events[eventKey];
  return (
    <div className="action-row">
      <a className="button button-gold" href={event.googleCalendarUrl} target="_blank" rel="noreferrer">
        Add to Google Calendar
      </a>
      <a className="button button-ghost" href={event.icsFile} download>
        Download 3-day reminder
      </a>
    </div>
  );
}

function EventCard({ eventKey }: { eventKey: "wedding" | "reception" }) {
  const event = wedding.events[eventKey];
  const isWedding = eventKey === "wedding";
  return (
    <article className={`event-card reveal ${isWedding ? "event-card-wine" : "event-card-ivory"}`} id={event.sectionId}>
      <div className="event-number">0{isWedding ? "1" : "2"}</div>
      <p className="eyebrow">{event.kicker}</p>
      <h2>{event.heading}</h2>
      {event.subheading && <p className="event-subheading">{event.subheading}</p>}
      <div className="gold-rule" />
      <p className="event-date">{event.displayDate}</p>
      <p className="event-time">{event.displayTime}</p>
      <p className="venue">{event.venue}</p>
      <p className="address">{event.addressLines.map((line) => <span key={line}>{line}<br /></span>)}</p>
      {event.afterText && <p className="after-text">{event.afterText}</p>}
      <a className={`button ${isWedding ? "button-light" : "button-wine"}`} href={event.mapsUrl} target="_blank" rel="noreferrer">
        Get directions <span aria-hidden="true">↗</span>
      </a>
      <CalendarActions eventKey={eventKey} />
    </article>
  );
}

export default function Home() {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    setCountdown(calculateCountdown());
    const timer = window.setInterval(() => setCountdown(calculateCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <nav className="floating-nav" aria-label="Invitation navigation">
        <a href="#invitation">Invitation</a>
        <a href="#wedding">Wedding</a>
        <a href="#reception">Dinner</a>
        <a href="#contact">Contact</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="ornament ornament-top">✦</div>
        <p className="hero-kicker">Together with their families</p>
        <div className="monogram" aria-hidden="true">T<span>&</span>B</div>
        <h1><span>{wedding.couple.groom}</span><em>&</em><span>{wedding.couple.bride}</span></h1>
        <p className="hero-date">{wedding.events.wedding.shortDate}</p>
        <p className="hero-venue">{wedding.events.wedding.venue} · Johor Bahru</p>
        <a href="#invitation" className="scroll-cue" aria-label="Read the invitation"><span>Discover our story</span><i>↓</i></a>
      </header>

      <section className="invitation paper-section" id="invitation">
        <div className="paper-frame reveal">
          <p className="eyebrow">With joyful hearts</p>
          <div className="family-intro">
            <p>{wedding.families.groom.parents[0]}<br />{wedding.families.groom.parents[1]}</p>
            <span>&</span>
            <p>{wedding.families.bride.parents[0]}<br />{wedding.families.bride.parents[1]}</p>
          </div>
          <p className="invitation-copy">cordially request your esteemed presence<br />to witness and bless our beloved children</p>
          <div className="couple-lockup"><strong>{wedding.couple.groom}</strong><em>weds</em><strong>{wedding.couple.bride}</strong></div>
          <p className="formal-copy">On Sunday, 15th of November 2026,<br />from 7:30pm to 9:00pm,<br />at Monet Garden By Diva,<br />No. 11, Jalan Bistari 12,<br />Taman Industri Jaya,<br />81300 Johor Bahru, Johor.<br /><i>and followed by dinner thereafter.</i></p>
        </div>
      </section>

      <section className="countdown-section reveal" aria-label="Wedding countdown">
        <p className="eyebrow">Counting every beautiful moment</p>
        <h2>{countdown.started ? "The celebration has begun" : "Until we say ‘I do’"}</h2>
        {!countdown.started && (
          <div className="countdown-grid">
            {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
              <div className="countdown-cell" key={unit}><strong>{String(countdown[unit]).padStart(2, "0")}</strong><span>{unit}</span></div>
            ))}
          </div>
        )}
      </section>

      <section className="events-section">
        <div className="section-heading reveal"><p className="eyebrow">Save the dates</p><h2>Our Celebrations</h2><p>Two evenings, one beautiful beginning.</p></div>
        <div className="events-grid"><EventCard eventKey="wedding" /><EventCard eventKey="reception" /></div>
      </section>

      <section className="quick-links reveal" aria-label="Event navigation">
        <p className="eyebrow">Choose your destination</p>
        <div><a href="#wedding">Wedding</a><a href="#reception">Dinner</a></div>
      </section>

      <section className="families-section">
        <div className="section-heading reveal"><p className="eyebrow">With blessings from</p><h2>Our Families</h2></div>
        <div className="family-grid">
          {(["groom", "bride"] as const).map((side) => (
            <article className="family-card reveal" key={side}>
              <p className="eyebrow">{side === "groom" ? "Groom’s family" : "Bride’s family"}</p>
              <h3>{wedding.families[side].parents[0]}<br />{wedding.families[side].parents[1]}</h3>
              <address>{wedding.families[side].addressLines.map((line) => <span key={line}>{line}<br /></span>)}</address>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-heading reveal"><p className="eyebrow">We would love to hear from you</p><h2>Contact Details</h2></div>
        <div className="contact-grid reveal">
          {(["groomSide", "brideSide"] as const).map((side) => (
            <div className="contact-card" key={side}>
              <p>{side === "groomSide" ? "Groom side" : "Bride side"}</p>
              {wedding.contacts[side].map((phone) => <a className="phone" href={`tel:${phone.replace(/\s/g, "")}`} key={phone}>{phone}</a>)}
              <a className="button button-wine" href={`tel:${wedding.contacts[side][0].replace(/\s/g, "")}`}>Call {side === "groomSide" ? "groom’s" : "bride’s"} side</a>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="monogram monogram-small">T<span>&</span>B</div>
        <h2>Thaneshvaran <em>&</em> Banu</h2>
        <p>15 · 11 · 2026</p>
        <p className="footer-note">Your presence is the greatest gift of all.</p>
      </footer>

    </main>
  );
}
