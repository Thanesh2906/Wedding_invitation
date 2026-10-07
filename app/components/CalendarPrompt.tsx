"use client";
import { useEffect, useRef } from 'react';
import GoogleCalendarButton from './GoogleCalendarButton';

export const APPLE_CALENDAR_URL = 'webcal://thanesh-banu-invitation.s-thaneshvaran.chatgpt.site/calendar/thaneshvaran-banu-celebrations.ics';
export default function CalendarPrompt({ onDismiss }: { onDismiss: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialogRef} className="calendar-prompt" aria-labelledby="calendar-prompt-title" aria-describedby="calendar-prompt-description" onCancel={onDismiss}>
    <button className="calendar-prompt-close" type="button" onClick={onDismiss} aria-label="Close calendar prompt">×</button>
    <p className="eyebrow">Save our special dates</p>
    <h2 id="calendar-prompt-title">Celebrate with us</h2>
    <p id="calendar-prompt-description">Add our wedding and reception to your calendar, with a reminder one day before each celebration.</p>
    <div className="calendar-prompt-dates"><span><strong>15 Nov</strong>Wedding & dinner</span><span><strong>21 Nov</strong>Wedding reception</span></div>
    <GoogleCalendarButton eventKeys={['wedding', 'reception']} combined />
    <div className="calendar-apple-option">
      <a className="button button-ghost" href={APPLE_CALENDAR_URL}>Add to Apple Calendar</a>
      <p>On iPhone, confirm the calendar subscription and keep event alerts enabled.</p>
      <a className="calendar-download-all" href="/calendar/thaneshvaran-banu-celebrations.ics" download>Download calendar file instead</a>
      <details><summary>Need help on iPhone?</summary><p>If the subscription does not open, use Safari. You can also download the file, send it to yourself as an email attachment, and open it in Apple Mail to import the events. Check each event’s alert is set to 1 day before.</p></details>
    </div>
    <button className="calendar-prompt-skip" type="button" onClick={onDismiss}>Maybe later · View invitation</button>
  </dialog>;
}
