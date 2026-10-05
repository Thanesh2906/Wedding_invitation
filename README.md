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

## Reference-inspired invitation

The page opens with an illuminated temple entrance and an **Open Invitation** button.
The invitation uses ivory and gold, followed by a scratch-to-reveal wedding date,
floral countdown, and navy event cards. The scratch card supports touch and mouse;
**Reveal our date** provides a keyboard-accessible alternative. Music starts when
opening the invitation and can be paused using the floating music button.

Decorative temple and lotus photographs are hosted locally. Attribution, source
links, licence details, and adaptations are recorded in `public/images/credits.txt`
and linked from the footer. These are decorative images, not venue photographs.

The personal gallery is disabled until actual couple photos are supplied. Add
photos at the paths listed in `data/wedding.json`, then set `gallery.enabled` to
`true`. All family, event, map, calendar, RSVP and contact details are preserved.

## Checks

```bash
npm test
npx tsc --noEmit
```

`npm test` checks the Malaysia-time countdown, expiry behavior, and both calendar
alarms, then builds and validates the Cloudflare Worker artifact. Shell scripts
must retain their executable file modes when checked out.

## Hosting

The current ChatGPT Site identity is stored in `.openai/hosting.json`.
The invitation is published at https://thanesh-banu-invitation.s-thaneshvaran.chatgpt.site
and initially available to its owner only.

## Animation sequence

Opening the invitation slides the two temple image panels apart, fades the cover,
and starts the couple-name sequence. Scroll reveals lift and unfold event cards;
floral imagery moves with scroll. Scratching or tapping the date fades the gold
layer and briefly illuminates the revealed date. The optional personal gallery
uses horizontal swipe and scroll snapping when enabled. Motion follows the
visitor's reduced-motion preference.
