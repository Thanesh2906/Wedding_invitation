"use client";
import { useEffect, useState } from 'react';
import wedding from '../../data/wedding.json';
import { CALENDAR_SCOPE, GOOGLE_CLIENT_ID, saveCalendarEvent, calendarPayload, type CalendarEventKey } from '../lib/google-calendar';

type TokenResponse = { access_token?: string; error?: string; scope?: string };
type GoogleOAuth = {
  initTokenClient: (config: { client_id: string; scope: string; include_granted_scopes: boolean; callback: (response: TokenResponse) => void; error_callback: (error: { type: string }) => void }) => { requestAccessToken: () => void };
  hasGrantedAllScopes: (response: TokenResponse, scope: string) => boolean;
};
declare global { interface Window { google?: { accounts?: { oauth2?: GoogleOAuth } } } }
let scriptPromise: Promise<void> | undefined;
function loadGoogle() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    const timer = setTimeout(() => { script.remove(); scriptPromise = undefined; reject(new Error('timeout')); }, 15000);
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); script.remove(); scriptPromise = undefined; reject(new Error('load')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export default function GoogleCalendarButton({ eventKeys, combined = false }: { eventKeys: CalendarEventKey[]; combined?: boolean }) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    let active = true;
    loadGoogle().then(() => { if (active) setReady(true); }).catch(() => { if (active) setStatus('Google Calendar could not load. Please refresh or download the calendar.'); });
    return () => { active = false; };
  }, []);
  function connect() {
    const oauth = window.google?.accounts?.oauth2;
    if (!oauth || busy) return;
    setBusy(true);
    setStatus('Choose your Google account and allow calendar access.');
    try {
      const client = oauth.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: CALENDAR_SCOPE,
        include_granted_scopes: false,
        error_callback: () => { setBusy(false); setStatus('Connection cancelled or blocked. Try again, allowing the Google popup.'); },
        callback: async (response) => {
          if (!response.access_token || response.error || !oauth.hasGrantedAllScopes(response, CALENDAR_SCOPE)) {
            setBusy(false); setStatus('Calendar permission was not granted. You can try again or download the calendar.'); return;
          }
          const saved: string[] = [];
          try {
            for (const key of eventKeys) {
              setStatus(`Adding ${wedding.events[key].heading.toLowerCase()}…`);
              await saveCalendarEvent(response.access_token, calendarPayload(key, wedding.events[key]));
              saved.push(wedding.events[key].heading);
            }
            setStatus(`${combined ? 'Both celebrations are' : 'Your event is'} saved in your Google Calendar with a reminder 1 day before.`);
          } catch (error) {
            setStatus(`${saved.length ? `${saved.join(' and ')} saved. ` : ''}${error instanceof Error ? error.message : 'Could not save. Please try again.'}`);
          } finally { setBusy(false); }
        },
      });
      client.requestAccessToken();
    } catch { setBusy(false); setStatus('Google connection could not open. Please refresh and try again.'); }
  }
  return <div className={`google-calendar-control${combined ? ' calendar-combined' : ''}`}>
    <button type="button" className="button button-gold" onClick={connect} disabled={!ready || busy} aria-busy={busy}>
      {busy ? 'Connecting to Google Calendar…' : combined ? 'Add Wedding & Reception to Google Calendar' : 'Add to Google Calendar'}
    </button>
    <p className="calendar-status" role="status" aria-live="polite">{status || (combined ? 'Allow Google Calendar access to save both dates with a 1-day reminder.' : 'Google permission required · 1-day reminder')}</p>
  </div>;
}
