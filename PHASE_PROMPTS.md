# PHASE_PROMPTS.md — Auto-École Manager
> One phase = one session. Each phase lists exactly which files to read.
> Complete every step. Run npm run build at the end. Fix all errors.

---

## PHASE 0 — Foundation
**Read: MASTER_PROMPT.md + PROJECT_CONTEXT.md + SCHEMA.md**

A. package.json
```
Dependencies:
  next@15, react@19, react-dom@19, typescript
  @prisma/client, prisma (dev)
  better-auth
  @uploadthing/react, uploadthing
  @react-pdf/renderer
  tailwindcss@3, autoprefixer, postcss (dev)
  @types/node, @types/react, @types/react-dom (dev)
  shadcn/ui radix deps, class-variance-authority, clsx, tailwind-merge
  lucide-react
  react-hook-form, @hookform/resolvers, zod
  sonner, date-fns, date-fns-tz
  bcryptjs, @types/bcryptjs
  papaparse, @types/papaparse
  xlsx
  @vercel/analytics

Scripts:
  dev, build, start, lint
  db:generate, db:migrate, db:seed, db:studio
  postinstall: "prisma generate"
```

B. Config files
```
tsconfig.json — strict: true, noImplicitAny: true, paths: @/*
.gitignore
.env.example — all vars from PROJECT_CONTEXT.md
postcss.config.js
next.config.ts:
  Security headers on non-API routes only:
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    Strict-Transport-Security: max-age=31536000; includeSubDomains
```

C. tailwind.config.ts
```
Tailwind v3 with shadcn preset
All color tokens from DESIGN.md exactly — so text-accent, bg-accent,
border-accent-dim etc all work as utilities
fontFamily: { sans: ['var(--font-inter)'] }
borderRadius: { lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', full: '9999px' }
content: includes globals.css
```

D. globals.css
```
@layer base: CSS custom properties for all color tokens
@layer components:
  .card-base { @apply bg-white rounded-xl border border-default p-6 }
  .btn-primary { @apply bg-accent hover:bg-accent-dark text-white px-4 py-2
                         rounded-lg text-xs font-bold uppercase tracking-wider
                         transition-all active:scale-95 }
  .btn-secondary { @apply bg-white hover:bg-bg-hover text-text-body
                           border border-default px-4 py-2 rounded-lg
                           text-xs font-medium transition-all }
  .table-header-cell { @apply text-[9px] font-bold uppercase tracking-widest text-muted }
  .input-base { @apply w-full px-3 py-2 text-sm bg-bg-input border border-default
                        rounded-lg focus:border-accent focus:ring-2
                        focus:ring-accent/10 focus:outline-none transition-all }
body: font-sans antialiased bg-bg-page text-text-body
```

E. lib/ files
```
lib/prisma.ts
  Singleton PrismaClient with global cache (dev hot reload safe)
  Middleware: intercept findMany + findFirst + findUnique
  Append { where: { ...args.where, deleted_at: null } }

lib/auth.ts
  better-auth configuration
  Session includes: id, email, role, schoolId, schoolName
  On login: write LoginLog row (ip from x-forwarded-for, user_agent)

lib/utils.ts
  formatMAD(n: number): string — "1 800,00 MAD"
  formatDate(d: Date): string — "14 avr. 2026"
  getInitials(name: string): string — "Mohamed Alami" → "MA"
  cn(...classes): string — clsx + tailwind-merge
  serialize<T>(data: T): T — converts Decimal→Number, Date→string recursively
  getCasablancaDate(): Date — today in Africa/Casablanca timezone
  isMoroccanHoliday(date: Date): boolean — checks pre-loaded holiday list
  MOROCCAN_HOLIDAYS: Date[] — all holidays from PROJECT_CONTEXT.md

lib/workflow.ts
  Complete implementation from PROJECT_CONTEXT.md:
  getMissingRequiredDocs(docs)
  isDossierComplete(docs)
  computePaymentStatus(remaining, paid, lastPaymentAt)
  computeNextAction(student)
  isExamReady(student)

lib/uploadthing.ts — client helpers

lib/env.ts — validates all required env vars on startup, throws if missing

lib/auth-helpers.ts
  withAuth(handler) — wraps API route, injects session, returns 401 if not authed
  withAdminAuth(handler) — requires super_admin role
```

F. prisma/schema.prisma
Complete schema from SCHEMA.md — copy exactly.

G. middleware.ts
```
Public routes: /login, /expired, /suspended, /api/auth/*, /_next/*, /favicon.ico
API routes (/api/*): skip middleware entirely
Super admin without school context: → /admin
Admin + trial valid: pass + set trial banner cookie
Admin + expired/suspended: → /expired or /suspended
```

H. types/index.ts
```
All TypeScript types and enums
StudentWithComputedFields from COMPONENTS.md
SessionWithRelations, PaymentWithStudent
Label maps for all enums (French labels)
Color maps: status → badge class
```

I. app/api/auth/[...all]/route.ts — better-auth handler

J. app/api/uploadthing/ — core.ts + route.ts
```
Routers:
  studentDocument: image + pdf, max 10MB, check Pro plan before upload
  schoolLogo: image only, max 2MB
```

K. app/(auth)/login/page.tsx
```
Full animated login page matching DESIGN.md Login Page spec:
  Dark navy bg (#071a2e)
  Moving grid + radial glows
  Floating particles (CSS animation)
  Road at bottom with animated dashed markings
  SVG car: dark green sedan with headlight beam + speed lines
  Glass morphism card (backdrop-blur-xl, bg-white/4, border-white/10)
  Logo + title "Bienvenue" + subtitle
  Email + password inputs (dark glass style)
  Remember me + forgot password
  Green gradient button with shine sweep animation
  Stats row: 200+ auto-écoles / 12k+ élèves / 98% satisfaction
On success: window.location.replace('/dashboard')
```

L. prisma/seed.ts
```
4 demo accounts (bcrypt hashed passwords)
Atlas school (Pro active):
  8 students: varied statuses + payments + doc completeness
  2 instructors: different permis authorizations + availability
  20 sessions: mix scheduled/completed/missed, code + conduite
  8 payments: some overdue
  3 exams: code + driving, mix of results
  2 expenses
  2 waiting list entries
  LoginLogs for atlas user
Étoile school (Starter trial, 5 days)
Sahara school (Starter expired)
```

Run: npm run build — zero errors before finishing.
Done when: atlas@autoecole.ma logs in and reaches a blank dashboard.

---

## PHASE 1 — Design System
**Read: MASTER_PROMPT.md + DESIGN.md + COMPONENTS.md**

Install shadcn/ui:
```
npx shadcn-ui@latest init
Add: button, card, input, label, select, table, tabs, dialog,
     alert-dialog, dropdown-menu, badge, progress, avatar,
     separator, sheet, switch, skeleton, tooltip, popover, scroll-area
```

Build components in this exact order. Each must match DESIGN.md exactly.

A. StatusBadge — props + style from COMPONENTS.md
B. StudentAvatar — SQUARE always. Props from COMPONENTS.md
C. ProgressBar — props from COMPONENTS.md
D. LoadingButton — wraps shadcn Button + Loader2 spinner
E. ConfirmDialog — wraps AlertDialog. Props from COMPONENTS.md
F. WhatsAppLink — wa.me link with icon. Props from COMPONENTS.md
G. InsightCard — props from COMPONENTS.md. Hover lift + link support
H. NextActionCard — dark bg-[#0f172a] card. Props from COMPONENTS.md
I. FilterPills — props from COMPONENTS.md
J. DossierStatus — uses getMissingRequiredDocs from lib/workflow.ts
K. PaymentSummary — props from COMPONENTS.md
L. AlertBanner — error banner. Props from COMPONENTS.md
M. ExamReadinessChecklist — 4 check items. Props from COMPONENTS.md
N. DocumentSlot — valid + missing states. Props from COMPONENTS.md
O. TrialBanner — amber/red sticky. Props from COMPONENTS.md
P. EmptyState — icon + title + description + action. Props from COMPONENTS.md
Q. Sidebar — from COMPONENTS.md AppShell section
R. Topbar — from COMPONENTS.md AppShell section
S. AppShell — Sidebar + Topbar + mobile sheet. Props from COMPONENTS.md
T. AdminShell + AdminSidebar — same pattern, super admin nav
U. app/(dashboard)/layout.tsx — fetch user + school, render AppShell
   app/(admin)/layout.tsx — check super_admin, render AdminShell
V. app/expired/page.tsx — centered card, amber, logout button
   app/suspended/page.tsx — centered card, red, logout button
W. app/dev/components/page.tsx — renders ALL components with sample props

Run: npm run build — zero errors.
Done when: /dev/components renders every component correctly.

---

## PHASE 2 — App Shell
**Read: MASTER_PROMPT.md + DESIGN.md + COMPONENTS.md**

A. Verify AppShell renders correctly on all dashboard routes
B. Sidebar navigation — all links work, active state correct
C. Topbar — search input functional (calls /api/search), bell icon, avatar
D. Mobile: hamburger visible below md, Sheet sidebar opens/closes
E. TrialBanner shows above topbar when subscription_status = trial
F. Impersonation banner slot (empty for now, ready for Phase 8)
G. Route titles — topbar shows correct page name per route
H. /api/search?q= — searches students by name+phone, scoped school_id, max 5 results

Run: npm run build — zero errors.
Done when: shell works on all pages, mobile sidebar works.

---

## PHASE 3 — Static Pages (Mock Data)
**Read: MASTER_PROMPT.md + DESIGN.md + COMPONENTS.md**

Build ALL pages with hardcoded mock data. No DB queries yet.
Goal: every page looks exactly right before touching the database.

A. Dashboard — mock 4 insight cards, mock session list with date navigator,
               mock "À traiter" column, mock end of day summary
B. Students list — mock table rows, filter pills, search bar, import button
C. Student profile — mock 5 tabs (Aperçu, Séances, Paiements, Examens, Documents)
                     mock NextActionCard, mock progress timeline
D. Sessions — weekly calendar view + list view toggle, mock session rows
E. Payments — alert banner, 3 stat cards, mock payments table, monthly summary
F. Exams — mock exam list with result badges, readiness checklist
G. Instructors — mock instructor table, availability indicator
H. Expenses — mock expense table, monthly summary
I. Waiting list — mock waiting list table
J. Settings — 4 tabs: Général, Sécurité, Notifications, Apparence
K. /admin — mock schools table, business overview numbers
L. /admin/schools/[id] — mock school detail, subscription card, login history
M. /admin/users — mock users table with login indicators

Run: npm run build — zero errors.
Done when: every page renders with mock data, looks correct visually.

---

## PHASE 4 — Real Data
**Read: MASTER_PROMPT.md + PROJECT_CONTEXT.md + SCHEMA.md**

Replace mock data with real Prisma queries. Server Components only.
Use Promise.all() for parallel queries. serialize() before passing to clients.

A. Dashboard — 4 parallel queries (today sessions, overdue, exam_ready, incomplete docs)
               computeNextAction for most urgent student
               Date navigator: query by selected date (default today, Africa/Casablanca)
B. Students list — fetch with payment aggregate + documents
                   compute payment_status + missing_docs per student
                   filter pills: all / overdue / incomplete / exam_ready
                   combined filters work (overdue AND incomplete)
C. Student profile — fetch with all relations
                     compute all StudentWithComputedFields
                     NextActionCard with real computeNextAction result
                     Progress timeline from all events (sessions, payments, exams)
D. Sessions — fetch with student + instructor
              weekly calendar: group by day of week
              filter by type (code/conduite) and status
E. Payments — fetch per school with student
              compute overdue count for alert banner
              monthly grouping for summary
              stat cards: total due, total collected, remaining
F. Exams — fetch with student, check code_exam_passed flag
G. Instructors — fetch with session count this month + completion rate
H. Expenses — fetch grouped by month
I. Waiting list — simple fetch
J. Settings — fetch school data for Général tab
K. /admin — fetch all schools with student count + subscription status
L. /admin/schools/[id] — fetch school + users + login history + subscription log
M. /admin/users — fetch users with last login + active indicator
N. /api/search — real search query

Run: npm run build — zero mock data anywhere.
Done when: every page shows real seed data.

---

## PHASE 5 — Write Operations
**Read: MASTER_PROMPT.md + PROJECT_CONTEXT.md + SCHEMA.md**

All API routes: withAuth(), Zod, school_id from session, plan limits, ActivityLog.
All forms: inline errors only (no toast for validation), LoadingButton.
Destructive actions: ConfirmDialog always.

A. Student CRUD
   POST /api/students — Zod validate, Starter limit 50, CIN regex check
   PATCH /api/students/[id] — update fields
   DELETE /api/students/[id] — soft delete + ConfirmDialog
   StudentForm wired to Add + Edit buttons

B. Instructor CRUD
   POST/PATCH/DELETE /api/instructors — Starter limit 5
   InstructorForm with multi-select permis + availability JSON

C. Session CRUD
   POST /api/sessions — Zod, conflict detection (instructor double-booked same time)
                        holiday check warning, school closing day check
                        recurring: create N sessions if is_recurring=true
   PATCH /api/sessions/[id] — status update with workflow side effects:
     completed → completed_sessions++ → check exam_ready → ActivityLog
     missed/cancelled → ActivityLog
   DELETE /api/sessions/[id] — soft delete + ConfirmDialog
   Inline Terminée / Manquée buttons on dashboard + session list + profile

D. Payment CRUD
   POST /api/payments — generate receipt_number (increment school.receipt_sequence)
                        update last_payment_at → ActivityLog
   DELETE /api/payments/[id] — soft delete + ConfirmDialog
   PaymentForm wired, WhatsApp receipt link shown after recording

E. Exam CRUD
   POST /api/exams — auto-calculate attempt_number
                     guard: type=driving + code_exam_passed=false → 400 error
   PATCH /api/exams/[id] — result update:
     passed + type=code   → student.code_exam_passed=true → ActivityLog
     passed + type=driving → student.status=passed → ActivityLog
     failed + type=driving → student.status=in_training → ActivityLog
   DELETE /api/exams/[id] — soft delete + ConfirmDialog

F. Expense CRUD
   POST/PATCH/DELETE /api/expenses

G. Waiting list CRUD
   POST/PATCH/DELETE /api/waiting-list

H. Settings writes
   PATCH /api/schools/[id]/info — school info (admin cannot change agrement_number)
   PATCH /api/schools/[id]/logo — logo upload via Uploadthing
   PATCH /api/schools/[id]/closing-days — array of dates
   POST /api/auth/change-password — bcrypt, old password verified first

I. Plan limit enforcement in every POST route that creates entities

Run: npm run build — test full workflow end to end.
Done when: can create student → schedule sessions → complete → auto exam_ready.

---

## PHASE 6 — Workflow Intelligence + Files + PDFs
**Read: MASTER_PROMPT.md + PROJECT_CONTEXT.md + SCHEMA.md**

A. NextActionCard — wire real computeNextAction on every student profile
   CTA button triggers correct form/action
   After session marked Terminée: if student becomes exam_ready
   → Sonner toast "🎉 [name] est prêt pour l'examen !"

B. Documents tab — upload slots matching DESIGN.md DocumentSlot spec
   POST /api/students/[id]/documents — Uploadthing, Pro plan check, create record
   DELETE /api/students/[id]/documents/[docId] — soft delete + ConfirmDialog
   Starter gate: show "Passez au plan Pro pour télécharger des documents."

C. CSV/Excel import
   ImportModal: upload → parse (papaparse/SheetJS dynamic import) → column mapping UI
   → validation preview per row → confirm → POST /api/students/import
   POST /api/students/import — batch create with duplicate detection
   Show import results: X imported, X skipped, X flagged

D. Receipt PDF (dynamic import @react-pdf/renderer)
   ReceiptPDF component — content from PROJECT_CONTEXT.md PDF Requirements
   Arabic font embedded (Amiri from Google Fonts CDN or bundled)
   GET /api/payments/[id]/receipt — generates + streams PDF
   Wire PDFDownloadLink on each payment row in student profile

E. Contract PDF
   ContractPDF component — all student fields + school info
   Arabic name rendered with Arabic font
   GET /api/students/[id]/contract — generates + streams PDF
   Wire button in student profile Aperçu tab

F. Dashboard insight cards link to filtered views (already done in Phase 4,
   verify all 4 links work with correct filter applied)

G. End of day summary — wire to real data, show in dashboard

Run: npm run build — test PDFs, uploads, import.
Done when: PDFs download, import works, NextActionCard correct on all statuses.

---

## PHASE 7 — Super Admin + Polish + Deploy
**Read: MASTER_PROMPT.md + PROJECT_CONTEXT.md + DESIGN.md**

A. Super admin writes
   PATCH /api/admin/schools/[id]/subscription
     actions: activate, trial, suspend, expire, reactivate
     ConfirmDialog on destructive actions
     SubscriptionLog entry on every action
   POST /api/admin/users — create admin account
   PATCH /api/admin/users/[id] — deactivate

B. Login history page at /admin/schools/[id]
   Show last 10 logins per user: IP, user_agent, timestamp
   Suspicious flag: 2 different IPs within 24h → warning badge
   Active indicator: green dot if last login < 24h ago

C. Loading states audit
   Every table: Skeleton rows while loading
   Every form: LoadingButton on every submit
   Inline session actions: disabled + spinner until response

D. Empty states audit
   Every list page has contextual EmptyState component
   Students: "Aucun élève — Ajoutez votre premier élève" + button
   Sessions: "Aucune séance — Planifiez la première séance" + button
   Payments: "Aucun paiement enregistré" 
   Exams: "Aucun examen planifié"
   Waiting list: "Liste d'attente vide"

E. Mobile audit
   All tables: overflow-x-auto wrapper
   Sidebar: Sheet overlay on mobile confirmed working
   Student profile tabs: horizontal scroll on mobile
   Forms: full width inputs on mobile

F. Cleanup
   Delete /app/dev/components/ page
   Remove all console.log statements
   Remove all TODO comments
   npm audit — fix high/critical severity

G. Final files
   .env.example — complete and accurate
   DEPLOY.md — step by step Vercel deploy instructions:
     1. Push to GitHub
     2. Create Vercel project → connect repo
     3. Add Neon integration in Vercel
     4. Add all env vars
     5. Build command: prisma migrate deploy && next build
     6. Run npm run db:seed in Neon console or via Vercel function

H. Deploy
   Push to GitHub → Vercel
   Test all 4 demo accounts on production URL
   Test: login, create student, schedule session, mark complete
   Test: PDF download, file upload (Pro account)
   Test: CSV import
   Test: mobile on real device

Run: npm run build — zero errors, zero warnings.
Done when: all 4 demo accounts work in production.

---

## Recovery Messages

Build failed:
```
The build failed. Read the full error output carefully.
Fix every TypeScript and ESLint error. Run npm run build again. Do not ask questions.
```

Stopped halfway:
```
Continue from where you stopped. Do not repeat completed steps.
Run npm run build when done.
```

Asking a question:
```
All context is in the files listed in this phase prompt. Read them and proceed. Do not ask.
```

UI looks wrong:
```
Read DESIGN.md again carefully. Fix every component that doesn't match.
Pay attention to: colors, border-radius, badge shapes, avatar shape (SQUARE), font sizes.
```
