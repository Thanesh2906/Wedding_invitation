# Thaneshvaran & Banu — Wedding Invitation

A mobile-first digital wedding invitation built with Next.js, React, TypeScript, Tailwind CSS, and Vinext.

## Features

- Elegant responsive invitation experience
- Live countdown to 15 November 2026 at 7:30 PM (Malaysia time)
- Separate wedding and bride's-family reception sections
- Google Maps directions for both venues
- Google Calendar links and downloadable `.ics` reminders set for three days before
- Tap-to-call contact actions on mobile
- All wedding content stored in `data/wedding.json`
- Accessible, reduced-motion-friendly animations

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

## Edit wedding details

Update `data/wedding.json`. The page reads names, family information, event details, map links, calendar links, and contact numbers from that file.

## Production build

```bash
npm run build
```
