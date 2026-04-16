# MASTER PROMPT — Auto-École Manager
> Paste FIRST in every Claude Code session. Then read the files listed in the phase prompt.

---

## What You're Building
Premium SaaS for Moroccan driving school owners.
Stack: Next.js 15, React 19, TypeScript strict, Neon, Prisma 5, better-auth,
shadcn/ui, Tailwind v3, Lucide React, Zod, Sonner, Uploadthing, @react-pdf/renderer,
papaparse, SheetJS, date-fns-tz, Vercel.

---

## UI Rules (from DESIGN.md)
- Page bg: #f4f6f8 — Cards: white, border border-default, rounded-xl
- Sidebar: white, w-60, active item = bg-accent-dim + border-l-2 border-accent
- Topbar: h-16
- Accent: #22c55e (green) — single token, never hardcode hex in components
- Text: #0f172a — never pure black
- Avatars: SQUARE (rounded-lg/xl/2xl) — never circular
- Badges: rounded-full always
- Labels: uppercase + tracking-wider always
- Table actions: opacity-0, visible on row hover only
- Cards: pure white, no gradient backgrounds
- Inter font via next/font/google — never CSS import

---

## Code Rules
1. Every DB query scoped with school_id from session
2. Soft delete only — deleted_at = now()
3. Prisma middleware: findMany + findFirst + findUnique all filter deleted_at IS NULL
4. Zod on every POST/PATCH — return 400 with field errors
5. withAuth() wrapper on every API route — school_id from session, never request body
6. withAdminAuth() for /api/admin/* routes
7. super_admin + no impersonation + school route → redirect /admin
8. "use client" on every component with hooks — first line
9. ActivityLog on every important action
10. Decimal → Number() before any client component
11. npm run build = zero errors before finishing any phase
12. No hardcoded secrets — all from env
13. postinstall: "prisma generate" in package.json
14. Plan limits checked before every insert
15. Auto-update student status after session complete + exam result
16. date-fns-tz with Africa/Casablanca for all date comparisons
17. Dynamic import for SheetJS and @react-pdf/renderer
18. serialize() helper in lib/utils.ts — convert all Prisma types before client
19. window.location.replace('/dashboard') after login — never router.push()
20. French UI, English code, real driving school wording

---

## Behavior
- Read the files listed in the phase prompt BEFORE doing anything
- No clarifying questions — all context is in the files
- Complete every step fully — no skeletons, no TODOs
- Run npm run build at the end of every phase — fix all errors before stopping

---

## Demo Accounts
```
admin@autoecole.ma  / Admin1234! → super_admin
atlas@autoecole.ma  / Admin1234! → Pro active (Atlas, Casablanca)
etoile@autoecole.ma / Admin1234! → Starter trial (Étoile, Rabat)
sahara@autoecole.ma / Admin1234! → Starter expired (Sahara, Marrakech)
```
