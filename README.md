# Misbah — Portfolio with Admin CMS

A modern, dark-mode-first personal portfolio for Misbah, a Computer Science student. Includes a **password-protected admin panel** for managing every piece of content — only the owner can edit; visitors see a read-only site.

Built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS**, **Framer Motion**, and **JSON file storage** (no database needed).

## Features

### Public site

- Animated hero with gradient name + typed role rotator
- Dark / light theme toggle with system fallback
- Smooth scrolling + anchor-aware navbar
- Sections: Home · About · Skills · Education · Projects · Experience timeline · Sketch Gallery · Journal · Contact
- Project cards with image hover-zoom, GitHub/Demo links, tag filter
- Alternating-side experience timeline
- Sketch gallery with masonry spans + lightbox
- Mobile-responsive
- **No edit controls visible to visitors** — admin UI is only reachable behind `/login`

### Admin (`/admin`)

- Password-gated dashboard (cookie-signed session, 7 days)
- Tabbed editor for every content type:
  - Site & Contact (name, role, email, location, social URLs)
  - About (intro, body paragraphs, stats)
  - Typing phrases (hero rotator)
  - Skills (groups + individual skills with icon picker)
  - Education (CRUD list)
  - Projects (CRUD with featured flag, image URL, tags, GitHub/Demo links)
  - Experience timeline (CRUD with bullets and tags)
  - Sketch gallery (CRUD with aspect spans)
  - Journal/Blog posts (CRUD)
- Add, edit, delete, **reorder** for every list
- Live icon preview when picking from the 40+ available `react-icons`
- Unsaved-changes guard (browser warns on accidental nav)
- Reset / Save / Logout in a sticky header
- Theme toggle works in admin too

## Stack

| Layer       | Tool                                  |
| ----------- | ------------------------------------- |
| Framework   | Next.js 14 (App Router) + TypeScript  |
| Styling     | Tailwind CSS                          |
| Animation   | Framer Motion                         |
| Icons       | react-icons (Si* + Fa*)               |
| Theming     | next-themes                           |
| Storage     | JSON file at `data/content.json`      |
| Auth        | HMAC-signed httpOnly cookie + middleware |
| Typography  | Inter · Space Grotesk · JetBrains Mono |

## Getting started

```bash
# 1. Install
npm install

# 2. Set credentials (or use defaults in .env.local)
#    ADMIN_PASSWORD=your-password
#    AUTH_SECRET=long-random-string

# 3. Dev server
npm run dev               # http://localhost:3000

# 4. Production
npm run build && npm start
```

**Default credentials (local dev only):**

```
URL:      http://localhost:3000/login
Password: admin
```

Change `ADMIN_PASSWORD` in `.env.local` before deploying.

## How content is stored

All content lives in **`data/content.json`** (auto-created on first save). The file mirrors the `Content` shape in `lib/types.ts`. If the file doesn't exist yet, the site falls back to `lib/defaults.ts`.

The admin panel reads this file at request time and writes the full JSON back atomically when you press **Save changes**. You can also edit the JSON directly with your favorite editor — both paths are safe.

## Security model

- **Visitors**: read-only. They can browse the site, scroll, filter projects, open sketches. They have no link to `/admin` and no edit/delete controls in the markup.
- **Owner**: visits `/login`, enters the password, gets a 7-day signed cookie. Middleware enforces this on every `/admin/*` request.
- **Write API** (`PUT /api/content`): re-verifies the cookie server-side before saving, so even if someone hits the API directly, they get 401 without a valid session.

Cookie is `httpOnly`, `sameSite=lax`, and `secure` in production builds.

## Project layout

```
.
├── app/
│   ├── layout.tsx              # html/body + ThemeProvider
│   ├── globals.css             # Tailwind + tokens
│   ├── (site)/                 # Public route group
│   │   ├── layout.tsx          # Navbar + Footer (fetches content)
│   │   └── page.tsx            # Composes section components
│   ├── login/page.tsx          # Owner login form
│   ├── admin/
│   │   ├── page.tsx            # Server: fetch content
│   │   └── AdminClient.tsx     # Client: tabbed editors
│   └── api/
│       ├── content/route.ts    # GET (public) + PUT (admin)
│       └── auth/
│           ├── login/route.ts  # POST password → cookie
│           └── logout/route.ts # POST → clear cookie
├── components/                 # Public-site section components
├── lib/
│   ├── types.ts                # Content type definitions
│   ├── defaults.ts             # Fallback content
│   ├── icons.ts                # Icon name → component map
│   ├── nav.ts                  # Static nav links
│   ├── storage.ts              # JSON file I/O (server-only)
│   └── auth.ts                 # Edge-safe HMAC session helpers
├── middleware.ts               # Guards /admin/*
├── data/                       # Created on first save
└── .env.local                  # ADMIN_PASSWORD, AUTH_SECRET
```

## Adding icons

Open `lib/icons.ts` and add the import + map entry, e.g.:

```ts
import { SiKubernetes } from "react-icons/si";
export const ICON_MAP = { ...existing, SiKubernetes };
```

The admin dropdown picks it up automatically because it iterates `Object.keys(ICON_MAP)`.

## Deploying

This setup uses local filesystem storage, which works on any host with a persistent disk (a VPS, Railway, Fly.io, Render, your laptop) but **does not work on Vercel / Netlify serverless** because their filesystem is read-only at runtime. For those, swap `lib/storage.ts` to write to a real database (Supabase, PlanetScale, Vercel KV) — the rest of the app is already shaped around the `Content` type.
