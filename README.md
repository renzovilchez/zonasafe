# ZonaSafe

Mapa interactivo de seguridad para El Porvenir, Trujillo — Perú. Ayuda a visitantes, compradores mayoristas y comerciantes a navegar el distrito conociendo las zonas de riesgo y encontrando mercados, fábricas y galerías de calzado.

🌐 **[zonasafe.vercel.app](https://zonasafe.vercel.app)**

---

## ¿Qué problema resuelve?

El Porvenir es el principal distrito productor de calzado del Perú. Miles de compradores mayoristas y visitantes llegan sin conocer la zona, sin saber qué calles evitar ni dónde están los destinos comerciales clave. ZonaSafe centraliza esa información en un mapa accesible desde cualquier celular.

---

## Funcionalidades

- 🗺️ **Mapa interactivo** centrado en El Porvenir con tiles de OpenStreetMap
- 🔴 **Zonas de seguridad** coloreadas por nivel — verde (seguro), ámbar (precaución), rojo (peligro)
- 📍 **Marcadores de destinos** — mercados, fábricas y galerías de calzado
- 🔍 **Buscador** con filtro por categoría
- 🧭 **Trazado de rutas** desde la ubicación del usuario hasta el destino elegido
- ⚠️ **Alertas de proximidad** cuando el usuario entra a una zona de riesgo
- 📲 **PWA instalable** — funciona como app nativa en Android e iOS
- 📡 **Modo offline** — datos cacheados para funcionar sin señal

---

## Stack técnico

| Capa                 | Tecnología                      |
| -------------------- | ------------------------------- |
| Framework            | Next.js 16 (App Router)         |
| Mapa                 | Leaflet + react-leaflet         |
| Base de datos        | Supabase (PostgreSQL + PostGIS) |
| Análisis geoespacial | Turf.js                         |
| Rutas                | OpenRouteService API            |
| Deploy               | Vercel                          |
| PWA                  | next-pwa                        |

---

## Estructura del proyecto

```
zonasafe/
├── app/                    # Rutas y API (Next.js App Router)
├── components/             # Componentes React
│   ├── Map/                # Mapa, zonas, marcadores, rutas
│   └── ui/                 # SearchBar, DestinationCard, MapLegend
├── hooks/                  # useGeoAlerts, useNotificationAlerts
├── lib/                    # supabase.ts, geo.ts, ors.ts
├── data/                   # Fallback offline (zones.json, destinations.json)
├── public/                 # Íconos PWA
├── types/                  # Tipos TypeScript compartidos
└── supabase/migrations/    # Schema inicial PostgreSQL + PostGIS
```

---

## Configuración local

### Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- API key de [OpenRouteService](https://openrouteservice.org)

### Instalación

```bash
git clone https://github.com/renzovilchez/zonasafe
cd zonasafe
npm install
```

### Variables de entorno

Crea `.env.local` en la raíz basándote en `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
ORS_API_KEY=tu_api_key
```

### Base de datos

Ejecuta el schema en el SQL Editor de Supabase:

```
supabase/migrations/001_initial.sql
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Despliegue

Deploy automático en Vercel con cada push a `main`. Variables de entorno requeridas en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ORS_API_KEY`.

---

## Licencia

MIT
