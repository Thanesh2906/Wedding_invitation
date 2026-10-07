export type CalendarEventKey = 'wedding' | 'reception';
export const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events.owned';
export const GOOGLE_CLIENT_ID = '1021390770719-dgpmo8evutkltn07sbpu3cf0238abr00.apps.googleusercontent.com';
const reminder = { useDefault: false, overrides: [{ method: 'popup', minutes: 1440 }] };

export function calendarPayload(key: CalendarEventKey, event: { isoStart: string; heading: string; venue: string; addressLines: string[] }) {
  return {
    id: key === 'wedding' ? 'tb20261115' : 'tb20261121',
    summary: `Thaneshvaran & Banu — ${event.heading}`,
    description: key === 'wedding' ? 'Wedding ceremony, followed by dinner thereafter.' : 'Wedding Reception on behalf of Bride’s Family.',
    location: [event.venue, ...event.addressLines].join(', '),
    start: { dateTime: event.isoStart, timeZone: 'Asia/Kuala_Lumpur' },
    end: { dateTime: key === 'wedding' ? '2026-11-15T21:00:00+08:00' : '2026-11-21T23:00:00+08:00', timeZone: 'Asia/Kuala_Lumpur' },
    reminders: reminder,
  };
}

export async function saveCalendarEvent(token: string, payload: ReturnType<typeof calendarPayload>, fetcher: typeof fetch = fetch) {
  const endpoint = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  let response = await fetcher(endpoint, { method: 'POST', headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000) });
  // Stable IDs avoid duplicates on repeat clicks or after a partial failure.
  if (response.status === 409) {
    response = await fetcher(`${endpoint}/${payload.id}`, { method: 'PATCH', headers, body: JSON.stringify({ reminders: reminder }), signal: AbortSignal.timeout(20000) });
  }
  if (!response.ok) {
    if (response.status === 401) throw new Error('Google access expired. Please connect again.');
    if (response.status === 403) throw new Error('Google could not allow calendar access. Please check permission or use the calendar download below.');
    throw new Error('This event could not be saved. Please try again or download the calendar.');
  }
}
