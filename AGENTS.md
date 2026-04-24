# AGENTS.md

## Stack (exact versions)

- Next.js 16.2.3, App Router only. No Pages Router, no getServerSideProps/getStaticProps/getInitialProps.
- React 19.2.4
- TypeScript 5, strict mode. Avoid `any` — comment if unavoidable.
- Tailwind CSS v4 (@tailwindcss/postcss). No tailwind.config.js.
- Leaflet 1.9.4 + react-leaflet 5. Leaflet touches `window` — every import requires `"use client"` + `dynamic(() => import(...), { ssr: false })`.
- Supabase JS 2, PostGIS enabled.
- Turf.js 7.
- next-pwa 5.6.

## Coordinate systems — critical

- Leaflet: [lat, lng]
- Turf.js: [lng, lat]
- GeoJSON: [lng, lat]
- PostGIS: [lng, lat]
- All conversions go through `lib/geo.ts`. Never convert inline.

## File conventions

- Map components → `components/Map/`
- Generic UI → `components/ui/`
- Hooks → `hooks/`, prefix `use`
- Utilities → `lib/`
- Shared types → `types/index.ts`
- API routes → `app/api/[resource]/route.ts`
- PascalCase for components, camelCase for hooks/utils.

## Database

- Supabase singleton in `lib/supabase.ts`. Do not instantiate new clients.
- Tables: `zones` (polygons, level 1-2-3), `destinations` (market/factory/gallery), `reports`.
- RLS active — anon key = read only. Service role key = never in frontend.
- Schema changes require a new migration in `supabase/migrations/`.

## Color palette (do not deviate)

- Brand blue: #185FA5
- Zone safe: fill #639922, stroke #3B6D11
- Zone caution: fill #EF9F27, stroke #854F0B
- Zone danger: fill #E24B4A, stroke #A32D2D
- Header bg: #185FA5, text white.
- Use Tailwind for layout/spacing, inline styles for palette colors only.

## PWA

- Manifest in `app/manifest.ts`. Do not edit JSON directly.
- Service Worker via next-pwa. Do not write SW manually.
- theme_color and background_color must stay #185FA5.

## Rules

- No alternative map libraries (mapbox, google maps).
- No localStorage — use sessionStorage for session state, Supabase for persistence.
- No direct Supabase fetch from components — use API routes.
- No console.log in production — console.error in catch blocks only.
- No new dependencies without justification (bundle size, maintenance cost).
- Do not refactor working code unless there is a concrete problem.

## Commands

```bash
npm run dev       # local dev
npm run pwa       # local PWA dev
npm run build     # production build (uses --webpack flag)
npm run lint      # eslint
```

## Color palette (do not deviate)

- Brand blue: #185FA5 (header bg, buttons, navbar, route line, badges)
- Zone level 1 (safe): fill #639922, stroke #3B6D11 — green polygon
- Zone level 2 (caution): fill #EF9F27, stroke #854F0B — amber polygon
- Zone level 3 (danger): fill #E24B4A, stroke #A32D2D — red polygon + push alert
- Header: bg #185FA5, all text white.
- Typography: Inter, system sans-serif. No other fonts.
- Tailwind for layout/spacing. Inline styles for palette colors only.
