"use client";
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import memories from '../../data/memories.json';

export default function MemoriesSlideshow() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  function goTo(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: reducedMotion ? 'instant' : 'smooth' });
  }
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !visible || reducedMotion) return;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const cards = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.clientWidth / 2;
      const index = cards.reduce((best, card, i) => Math.abs(card.offsetLeft - track.offsetLeft + card.clientWidth / 2 - center) < Math.abs(cards[best].offsetLeft - track.offsetLeft + cards[best].clientWidth / 2 - center) ? i : best, 0);
      goTo((index + 1) % memories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [playing, visible, reducedMotion]);
  function updateActive() {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    const index = cards.reduce((best, card, i) => Math.abs(card.offsetLeft - track.offsetLeft + card.clientWidth / 2 - center) < Math.abs(cards[best].offsetLeft - track.offsetLeft + cards[best].clientWidth / 2 - center) ? i : best, 0);
    setActive(index);
  }
  return <section className="memories-section" id="memories" ref={sectionRef} aria-labelledby="memories-title">
    <div className="section-heading"><p className="eyebrow">Our journey together</p><h2 id="memories-title">Few Memories</h2></div>
    <div className="memories-track" ref={trackRef} onScroll={updateActive} onPointerDown={() => setPlaying(false)} onKeyDown={() => setPlaying(false)} tabIndex={0} aria-label="Memory slideshow. Swipe or use the slide buttons.">
      {memories.map((memory, index) => <article className="memory-slide" key={memory.id} aria-label={`${index + 1} of ${memories.length}: ${memory.title}`}>
        <div className="memory-photo">
          {memory.src ? <img src={memory.src} alt={memory.alt} loading="lazy" /> : <div className="memory-awaiting"><span className="memory-monogram" aria-hidden="true">T <i>&</i> B</span><p>Photos coming soon</p></div>}
          <span className="memory-number">0{index + 1}</span>
        </div>
        <p className="memory-caption">{memory.title}</p>
      </article>)}
    </div>
    <div className="memories-controls">
      <button type="button" className="memory-control" onClick={() => { setPlaying(false); goTo((active - 1 + memories.length) % memories.length); }} aria-label="Previous memory">‹</button>
      <div className="memory-dots" aria-label="Choose a memory">{memories.map((memory, index) => <button type="button" key={memory.id} aria-label={`View ${memory.title}`} aria-current={index === active ? 'true' : undefined} onClick={() => { setPlaying(false); goTo(index); }}><span /></button>)}</div>
      <button type="button" className="memory-control" onClick={() => { setPlaying(false); goTo((active + 1) % memories.length); }} aria-label="Next memory">›</button>
    </div>
    <p className="memory-progress" aria-live="polite">{active + 1} / {memories.length} · {memories[active].title}</p>
    {!reducedMotion && <button className="memory-play" type="button" onClick={() => setPlaying(!playing)}>{playing ? 'Pause slideshow' : 'Play slideshow'}</button>}
  </section>;
}
