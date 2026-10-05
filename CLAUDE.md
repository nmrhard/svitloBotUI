# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Admin UI for **Svitlo Bot** (a Telegram bot that posts power-outage schedules). Users sign in with Firebase Auth and manage bot **contacts** (Telegram chats/threads + daily schedule image/JSON sources) and their **schedules** (send windows, interval, timezone). The UI does not own the data — it calls a separate backend API documented in `API.md` (written in Ukrainian).

## Commands

```sh
npm run dev         # Astro dev server, http://localhost:4321
npm run emulators   # Firebase Auth (9098) + Storage (3005) emulators, UI on 4001 — required for dev auth
npm run build       # production build (Netlify adapter)
npm run preview
npm run lint        # ESLint (flat config: TS, Astro, react-hooks)
npm run lint:fix
npx astro check     # type-check .astro + .ts (@astrojs/check is installed)
```

There is no test runner configured yet. `.claude/rules/testing.mdc` defines testing conventions (`*.spec.ts` next to the code, AAA, one assertion per `it`, prefer fakes over call-order mocks) — if adding tests, add a runner and `test` script first rather than assuming one.

## Architecture

- **Astro 5, `output: 'server'`, Netlify adapter.** Pages in `src/pages/*.astro` are SSR. React 19 is used only for interactive islands (`client:load`), currently the contacts/schedules manager.
- **Auth flow (two Firebase SDKs):**
  - Client: `src/scripts/firebase/init.ts` (Firebase web SDK; connects to the Auth emulator when `import.meta.env.DEV`). Auth pages (`signin`, `signup`, `forgot-password`, `reset-password`) use inline `<script>` blocks with the web SDK.
  - After sign-in the client redirects to `/?token=<idToken>`. Protected pages (`index.astro`, `contact-list.astro`) read the token from the `?token` param or the `X-Token` cookie (`src/constants/cookies.ts`), verify it with `firebase-admin` (`src/scripts/firebase/initServer.ts`), set the httpOnly cookie, or redirect to `/signin`. This guard is duplicated in each protected page's frontmatter.
  - Server admin SDK credentials come from `FIREBASE_*` env vars (see `env.d.ts`; values in `.env`). In dev it points at the emulators.
- **Backend API calls** go from the browser directly to the external bot backend: `src/scripts/api/contacts.ts` wraps `fetch` with `Authorization: Bearer <Firebase ID token>` from `auth.currentUser` and redirects to `/signin` on 401. Base URL is in `src/constants/api.ts` (`localhost:3000` in development, `svitlobot.onrender.com` otherwise). Request/response shapes live in `src/types/contacts.ts` and must match `API.md`.
- **Contacts UI** (`src/components/contacts/`, `src/components/schedule/`): `ContactsManager.tsx` is the single island and switches between list / create / edit / schedules views via local `viewMode` state (no router, no global store).
- **Validation:** all form validation uses **valibot** schemas in `src/scripts/validation/schemas.ts`, run through `validateForm()` in `helpers.ts`, which returns `{ success, data }` or a flat `field -> message` error map. Add new form rules there rather than inline. The schedule timezone is restricted to the `POPULAR_TIMEZONES` list in that file.
- **Styling:** Tailwind with `darkMode: 'class'` and a custom `primary` palette (`tailwind.config.mjs`).

## Conventions and gotchas

- Path aliases (`tsconfig.json`): `@scripts/*`, `@constants/*`. `@components/*` is mapped to `src/components` without `/*`, so it doesn't resolve per file — existing code imports components relatively (or via `src/...`).
- ESLint: `no-console` warns except `console.warn`/`console.error`.
- `src/pages/api/auth/signout.ts` exports lowercase `post`/`all`; Astro 5 expects uppercase method exports (`POST`, `ALL`), so this endpoint is likely not wired. Sign-out currently happens client-side in `Layout.astro` (`auth.signOut()`).
