# Scheda — Project Guidelines for AI Assistants

This file is the source of truth for any AI assistant (Copilot, Cursor, Antigravity, Gemini, etc.) working on this codebase. Follow these rules exactly. If a suggestion conflicts with this file, this file wins.

---

## 1. Tech Stack (hard constraints — do not deviate)

- **React.js** (Vite-based, NOT Next.js — no `"use client"`, no `app/` router, no Next.js APIs)
- **TypeScript** — all files `.tsx`/`.ts`, no `.jsx`/`.js`
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/index.css`. No `tailwind.config.js`.
- **React Router DOM** — all routing/navigation
- **@phosphor-icons/react** — the ONLY icon library (see Section 5)
- **Firebase** — Auth, Firestore, (Cloud Functions later)
- **clsx** — for conditional className logic
- **Hand-built UI primitives** — no component library. Buttons, dialogs, selects, etc. are built
  from scratch in `components/ui/` using Tailwind + our own tokens (see Section 4)

### Explicitly banned
- ❌ Material UI (MUI) — fully removed, do not reintroduce `@mui/*` imports
- ❌ shadcn/ui — not used on this project, do not run `npx shadcn` or reference it in any file
- ❌ Any other component library (Chakra, Ant Design, Radix used directly as a dependency, Mantine, etc.)
- ❌ MUI Icons, Lucide, or any icon library other than Phosphor
- ❌ Arbitrary Tailwind hex brackets, e.g. `text-[#0a0a0a]` — use named tokens (`text-black`) instead
- ❌ `next/*` imports, `"use client"`, `"use server"`, or any Next.js-specific API
- ❌ `localStorage`/`sessionStorage` inside any component that might later run in a non-browser context — fine for `theme-provider.tsx` specifically, but don't casually add it elsewhere without checking

---

## 2. Folder Structure (component-based architecture)

```
src/
  components/
    ui/              # hand-built primitives ONLY (Button.tsx, Modal.tsx, Select.tsx, etc.) — plain Tailwind + our tokens, no external component library
    shared/           # custom reusable components (GlassCard, TitleComponent, ThemeSwitch, etc.)
    layout/           # Header, Sidebar, DashboardShell, per-role nav
  pages/
    admin/            # Admin-only route components
    member/           # Member-only route components
    client/           # Client-only route components
    auth/             # Login, Signup, Forgot Password
    landing page.tsx, 404.tsx, etc.
  routes/
    AppRoutes.tsx      # React Router route definitions
    ProtectedRoute.tsx # Role-based route guard
  lib/
    firebase.ts        # Firebase init/config
    utils.ts            # cn() helper, generic utils
  hooks/
    useAuth.ts
    useTheme.ts         # re-export from theme-provider for convenience
  types/
    index.ts            # shared TS types (User, Appointment, Availability, etc.)
  context/
    theme-provider.tsx
  index.css            # Tailwind v4 entry + @theme tokens
```

**Rule:** one component per file. No default-exporting multiple components from a shared file
unless it's a tightly-coupled compound component (e.g. `Card` + `CardHeader`).

---

## 3. Design System — Tailwind v4 Tokens (source of truth)

All design tokens live in `src/index.css` under `@theme`. This file already defines:

- Colors: `--color-primary`, `--color-tint-gray`, `--color-black`, `--color-tint-black`, `--color-grey`, gradient pairs
- Shadows: `--shadow-shadow1`, `--shadow-shadow2`, `--shadow-inset`
- Font sizes: `--font-size-h1` through `--font-size-xss` (fluid via `clamp()`)
- Custom utilities: `.glass-card-inset`, `.glass-card-inset-2`, `.glass-card-effect`, `.glass-card-light`, `.text-stroke-outlined`, `container`, `container-fluid`

**Hard rule:** Never invent a new hex value inline. If a color/size isn't in `@theme` yet, add it
there first, then reference it via the generated utility class. This keeps every component
pulling from one file.

**Note:** `--font-geist: Geist` is declared but the font isn't imported anywhere yet. Add a
`@font-face` or Google Fonts `@import` at the top of `index.css` before shipping — otherwise it
silently falls back to the system font.

---

## 4. Hand-Built UI Primitives (`components/ui/`)

There is no component library on this project. Every primitive — button, modal, dropdown, select,
tooltip, tabs, etc. — is built by hand in `components/ui/` using plain Tailwind classes tied to our
`@theme` tokens.

### Rules for AI assistants building primitives
- **Before creating a new primitive, check `components/ui/` first** — don't duplicate an existing
  `Button` because a new page needs a slightly different one; extend it with a variant prop instead
- Style exclusively with our existing tokens (Section 3) — no arbitrary hex, no invented shadows
  or radii not already defined in `@theme`
- For accessibility-sensitive primitives (modal/dialog, dropdown menu, tooltip), pay explicit
  attention to keyboard navigation, focus trapping, and `aria-*` attributes — these are easy to get
  wrong when hand-building without a library, and are not optional
- Keep primitives generic and reusable — no booking/appointment-specific logic inside
  `components/ui/`. Compose primitives into app-specific components inside `components/shared/`
  instead (e.g. an `AppointmentCard` built from `components/ui/Card.tsx`)
- Each primitive gets its own file, typed props via `interface <ComponentName>Props`, and should
  support a `className` passthrough prop (merged via `clsx`) so it can be customized per usage
  without editing the primitive itself

### Suggested build order (only build what's actually needed, when needed)
`Button` → `Input` → `Card` → `Modal/Dialog` → `Select` → `Tabs` → `Badge` → `Table` →
date/time picker (this one is the most involved — plan for it separately when building the
availability calendar, likely via a lightweight headless library like `react-day-picker` for the
date logic only, styled entirely with our own Tailwind, not a pre-styled component)

---

## 5. Icons — Phosphor Only

```tsx
import { CalendarIcon, UserIcon, ClockIcon } from "@phosphor-icons/react";

<CalendarIcon size={20} weight="regular" />
```

- Default `weight` across the app: `regular`. Use `bold` sparingly for emphasis (active nav state, etc.) — pick one secondary weight and stay consistent.
- Never `npm install` `lucide-react` or any other icon package.

---

## 6. Component Conventions

- Functional components only, typed props via `interface`, not `type` (project convention — stay consistent)
- Props interface named `<ComponentName>Props`
- Use `clsx` for any conditional className logic — never string concatenation or template literals for classNames
- Prefer composition over prop-explosion — if a component needs more than ~6 props, consider splitting it
- No inline styles (`style={{}}`) except for truly dynamic values Tailwind can't express (e.g. a computed `translateX` from JS state)

---

## 7. Migrating Existing Components (from the Next.js/MUI prototype)

These components already exist from earlier prototyping and need adjustment before reuse:

### `GlassCard`
Currently wraps MUI's `Paper`. **Rewrite without MUI** — the glass effect is entirely CSS
(`glass-card-inset` / `-inset-2` / `-effect` utilities already in `index.css`), so MUI was never
load-bearing here. Rebuild as a plain `div` wrapper (see Section 4 conventions — this now also
counts as one of your `components/shared/` building blocks).

### `theme-provider.tsx`
Logic is framework-agnostic and fine as-is — just **remove `"use client"`** (Next.js-only
directive, meaningless in Vite/React Router and safe to delete).

### `theme-switch.tsx`
Same fix — **remove `"use client"`**. Everything else (Phosphor icons, glass utility classes) is
already correct, no changes needed.

### `title-component.tsx`
No changes needed — already framework-agnostic, no MUI or Next.js dependency. Good template for
how typography components should be written going forward.

---

## 8. Firebase Conventions

- All Firebase init lives in `src/lib/firebase.ts` — single instance, imported everywhere else
- Firestore collections: `users`, `appointments`, `availability` (finalize exact schema before scaffolding CRUD — don't let AI assistants invent collection names ad hoc)
- Role is stored as a `role` field on the `users` document (`"admin" | "member" | "client"`) — check this via a custom `useAuth()` hook, never re-derive role from route path
- Never write Firestore security rules that default to `allow read, write: if true` outside of local dev/demo seeding — flag it explicitly in a code comment if temporarily permissive

---

## 9. TypeScript Rules

- `strict: true` in `tsconfig.json` — no loosening this
- No `any` — use `unknown` and narrow, or define a proper type
- Shared domain types (`User`, `Appointment`, `AvailabilitySlot`) live in `src/types/index.ts` — import from there, don't redefine locally in component files

---

## 10. Quick Reference — Do / Don't

| Do | Don't |
|---|---|
| Add new colors/sizes to `@theme` first | Use arbitrary hex brackets |
| Check `components/ui/` before building a new primitive | Duplicate an existing primitive with slightly different styling |
| Import icons from `@phosphor-icons/react` | Import Lucide, MUI Icons, or any other icon set |
| Keep `components/ui/` generic | Put booking/appointment logic inside `components/ui/` |
| Strip Next.js artifacts (`"use client"`, `next/*`) when reusing old prototype files | Copy-paste old Next.js/MUI components in unmodified |
| Store role on the Firestore user doc, check via `useAuth()` | Infer role from the current route |
| Hand-build primitives with Tailwind + our tokens | Install shadcn, MUI, or any other component library |