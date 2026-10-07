import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calendarPayload, saveCalendarEvent } from '../app/lib/google-calendar.ts';
const wedding = JSON.parse(readFileSync(new URL('../data/wedding.json', import.meta.url)));
test('both events retain Malaysia times and explicitly override reminders to one day', () => {
 for (const key of ['wedding', 'reception']) {
  const event = calendarPayload(key, wedding.events[key]);
  assert.match(event.id, /^[a-v0-9]{5,}$/);
  assert.equal(event.start.dateTime, wedding.events[key].isoStart);
  assert.equal(event.start.timeZone, 'Asia/Kuala_Lumpur');
  assert.ok(Date.parse(event.end.dateTime) > Date.parse(event.start.dateTime));
  assert.deepEqual(event.reminders, { useDefault:false, overrides:[{method:'popup',minutes:1440}] });
 }
});
test('repeat additions update the alarm without creating a second event', async () => {
 const calls=[];
 const fakeFetch=async (url, init) => { calls.push({url,init}); return new Response(null,{status:calls.length===1?409:200}); };
 const event=calendarPayload('wedding',wedding.events.wedding);
 await saveCalendarEvent('test-token',event,fakeFetch);
 assert.equal(calls[0].init.method,'POST');
 assert.equal(calls[1].init.method,'PATCH');
 assert.ok(calls[1].url.endsWith('/tb20261115'));
 assert.deepEqual(JSON.parse(calls[1].init.body),{reminders:event.reminders});
});
test('denied API access never reports success', async () => {
 await assert.rejects(saveCalendarEvent('test-token',calendarPayload('reception',wedding.events.reception),async()=>new Response(null,{status:403})),/could not allow/);
});
test('combined calendar contains both events and one-day alarms', () => {
 const file=readFileSync(new URL('../public/calendar/thaneshvaran-banu-celebrations.ics',import.meta.url),'utf8');
 assert.equal((file.match(/BEGIN:VEVENT/g)||[]).length,2);
 assert.equal((file.match(/TRIGGER:-P1D/g)||[]).length,2);
 assert.ok(file.includes('DTSTART:20261115T113000Z'));
 assert.ok(file.includes('DTSTART:20261121T113000Z'));
});
