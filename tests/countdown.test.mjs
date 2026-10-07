import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { calculateCountdown } from '../app/lib/countdown.ts';
const wedding = JSON.parse(readFileSync(new URL('../data/wedding.json', import.meta.url)));

test('Malaysia event time represents 11:30 UTC and counts across midnight', () => {
  const start = wedding.events.wedding.isoStart;
  assert.equal(new Date(start).toISOString(), '2026-11-15T11:30:00.000Z');
  assert.deepEqual(calculateCountdown(start, Date.parse('2026-11-14T09:28:57Z')), { days: 1, hours: 2, minutes: 1, seconds: 3, started: false });
});
test('at and after the ceremony the countdown stops without negative values', () => {
  const now = Date.parse(wedding.events.wedding.isoStart);
  for (const time of [now, now + 86400000]) {
    assert.deepEqual(calculateCountdown(wedding.events.wedding.isoStart, time), { days: 0, hours: 0, minutes: 0, seconds: 0, started: true });
  }
});
test('both event calendars exist and include a one-day alarm', () => {
  for (const event of Object.values(wedding.events)) {
    const file = new URL(`../public${event.icsFile}`, import.meta.url);
    assert.ok(existsSync(file));
    const calendar = readFileSync(file, 'utf8');
    assert.match(calendar, /TRIGGER:-P1D/);
    assert.ok(event.mapsUrl.startsWith('https://www.google.com/maps/'));
  }
});
