# CLAUDE.md

## Project

ZonaSafe — interactive safety map PWA for El Porvenir, Trujillo, Peru. El Porvenir is Peru's main footwear manufacturing district. App helps wholesale buyers and visitors navigate the district by showing risk zones and locating markets, factories, and galleries.
Developer: Renzo Vilchez (student). Academic project, live at https://zonasafe.vercel.app.

## How Claude is used

- Via claude.ai web UI, not agent mode or Claude Code.
- Tasks: architecture, Supabase/PostGIS setup, React components, Vercel config, PWA, color palette, documentation.
- Development is incremental, feature by feature.

## Response rules

- Always respond in Spanish.
- Be direct — developer has full project context, skip obvious explanations.
- Provide complete file or exact replacement block — no ambiguous fragments.
- Prefer prose over bullet lists when clearer.
- Mobile-first — app is used on phone in the field.

## Priorities

1. Functionality over UI.
2. Real data over placeholder data — zones must have a real source field.
3. Mobile first.

## Do not

- Suggest new libraries without justifying bundle/maintenance cost.
- Refactor working code without a concrete reason.
- Change established naming conventions.
- Use `any` in TypeScript without an explanatory comment.

## Completed features

MapHeader, MapLegend, MapContainer (dynamic, no SSR), ZoneLayer, DestinationMarkers, UserLocation, RouteLayer, ProximityAlert, LocateButton, SearchBar (category filter), DestinationCard, useGeoAlerts, useNotificationAlerts, lib/geo.ts (Turf.js), lib/ors.ts (OpenRouteService), API routes /api/zones + /api/destinations + /api/reports, PWA manifest, next-pwa service worker, README, AGENTS.md, CLAUDE.md.

## Key files

- `components/Map/LeafletMap.tsx` — main map component
- `lib/geo.ts` — all geospatial logic
- `lib/supabase.ts` — singleton client
- `hooks/useGeoAlerts.ts` — GPS + zone detection
- `app/manifest.ts` — PWA config
- `supabase/migrations/001_initial.sql` — DB schema

## Design tokens

- Brand: #185FA5 — header, buttons, route, badges
- Zone 1 safe: #639922 / #3B6D11
- Zone 2 caution: #EF9F27 / #854F0B
- Zone 3 danger: #E24B4A / #A32D2D
- Typography: Inter, system sans-serif
- Tagline: "Navega seguro, llega con confianza"
