# MadaVibes - Premium Madagascar Tourism

Apple-inspired tourism platform for Madagascar, built with React + Tailwind CSS + Leaflet + Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Stack

- React 18 + Vite
- Tailwind CSS (Malagasy sunset palette)
- Leaflet + OpenStreetMap
- Framer Motion
- Lucide React
- PWA manifest + Service Worker offline mode

## Core Features

- Interactive Madagascar map with 30+ destinations including Nosy Be, RN7, Tsingy, Isalo, and Ile Sainte-Marie.
- Real-time activity intelligence:
	- Whale watching (July-October)
	- Lemur treks
	- Night walks and chameleon season cues
- Local guide booking section with verified Malagasy guide profiles and WhatsApp booking links.
- Live MGA to EUR/USD converter (with resilient fallback rates).
- Offline region download toggles (RN7, Nosy Be, Sainte-Marie, Tsingy).
- Mobile-first swipe discovery and 7-day drag-and-drop itinerary builder.

## Deploy in 60 Seconds

1. Fork repository
2. Import to Vercel
3. Deploy

`vercel.json` includes SPA rewrite support for client-side routing.

## PWA

- Installable app via browser "Add to home screen"
- Offline support for cached core app shell + visited content
- Mobile screenshots (x4):
	- `public/screenshots/mobile-1.svg`
	- `public/screenshots/mobile-2.svg`
	- `public/screenshots/mobile-3.svg`
	- `public/screenshots/mobile-4.svg`

## Content Updates

- Edit destinations and guide data in `src/App.jsx`.
- Update branding and SEO metadata in `index.html`.
- Adjust color system in `tailwind.config.js`.

## Domain

`madavibes.mg`

Made for Madagascar with love.
