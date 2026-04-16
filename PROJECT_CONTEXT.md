# PROJECT_CONTEXT.md — Auto-École Manager
> Features, workflow logic, auth flow. Read with SCHEMA.md for DB work.

---

## What It Is
Premium daily-use SaaS for Moroccan driving school owners.
Replaces notebooks, WhatsApp, Excel.
Owner opens at 8am → immediately knows what needs attention.

---

## Roles
```
super_admin → /admin panel only. Never blocked. Manages schools + subscriptions.
admin       → Their school only. Blocked if expired or suspended.
```
No public signup. Super admin creates all accounts manually.

---

## Stack
Next.js 15, React 19, TypeScript strict, Neon, Prisma 5,
better-auth, shadcn/ui, Tailwind v3, Lucide React,
React Hook Form + Zod, Sonner, Uploadthing,
@react-pdf/renderer, papaparse, SheetJS, date-fns-tz, Vercel

---

## Auth Flow (better-auth)
```
POST /api/auth/signin
→ find User by email
→ bcrypt.compare password
→ session: { id, email, role, schoolId, schoolName }
→ write LoginLog row (ip, user_agent, timestamp)
→ middleware:
    super_admin + no impersonation + school route → /admin
    admin + active                                → pass
    admin + trial valid                           → pass + TrialBanner
    admin + expired/suspended                     → /expired or /suspended

Post-login: window.location.replace('/dashboard') — never router.push()
schoolId always from server session — never from request body
```

---

## Middleware Rules
```
Public routes (no auth check):
  /login, /expired, /suspended, /api/auth/*, /_next/*, /favicon.ico

API routes (/api/*):
  Excluded from middleware — handle own auth via withAuth() wrapper

Security headers:
  Applied to all non-API routes only
```

---

## Plans
```
Starter: 149–X MAD | 50 students | 5 instructors | no uploads
Pro:     299–X MAD | unlimited   | unlimited     | uploads enabled
Periods: monthly / quarterly / semi-annual / annual
Price set manually by super admin per school
```

---

## Pages

### School Admin
```
/dashboard              Decision dashboard
/students               List + filters + search + import
/students/new           Add student form
/students/[id]          5-tab profile
/students/[id]/edit     Edit student
/sessions               Weekly calendar + list view
/payments               Payments register + overdue alerts
/exams                  Exam list + results
/instructors            Instructor list + availability
/expenses               Expense log
/settings               4 tabs
/waiting-list           Waiting list management
```

### Super Admin
```
/admin                  Schools list + business overview
/admin/schools/[id]     School detail + subscription + notes + log
/admin/users            User management
```

### Blocked
```
/expired
/suspended
```

---

## Workflow Intelligence (lib/workflow.ts)

### Auto Status Updates
```
Session → completed:
  completed_sessions++
  last_session_at = now()
  if completed_sessions >= total_sessions_required AND status = in_training
    → status = exam_ready
  ActivityLog entry

Exam code → passed:
  student.code_exam_passed = true
  ActivityLog

Exam driving → passed:
  student.status = passed
  ActivityLog

Exam driving → failed:
  student.status = in_training
  ActivityLog

Payment added:
  last_payment_at = now()
  increment school.receipt_sequence
  receipt_number = REC-{YEAR}-{sequence padded to 4 digits}
  ActivityLog
```

### computeNextAction(student)
```
enrolled + completed = 0
  → "Planifier la première séance" | cta: Planifier

in_training + remaining > 0
  → "Planifier une séance (X restantes)" | cta: Planifier

in_training + remaining = 0
  → "Sessions complètes — valider pour examen" | cta: Valider

exam_ready + code_exam_passed = false
  → "Passer l'examen code en premier" | cta: Programmer | urgent: true

exam_ready + code_exam_passed = true
  → "Programmer l'examen de conduite" | cta: Programmer | urgent: true

missing_docs.length > 0 (any status)
  → "Compléter le dossier (X manquants)" | cta: Compléter

remaining_balance > 0 + days_since_payment > 14
  → "Encaisser le solde — X MAD" | cta: Paiement | urgent: true

passed
  → "Élève reçu — dossier terminé ✓"
```

### computePaymentStatus(student)
```
remaining_balance <= 0               → paid
amount_paid = 0                      → never_paid
days_since_payment > 14              → overdue
remaining > 0 + days <= 14           → partial
```

### getMissingRequiredDocs(docs)
```
REQUIRED = ['cin', 'medical', 'contrat']
return REQUIRED.filter(type => not in uploaded docs)
Labels: { cin: 'CIN', medical: 'Médical', contrat: 'Contrat' }
```

### isExamReady(student)
```
completed_sessions >= total_sessions_required
AND dossier_complete
AND remaining_balance = 0
AND code_exam_passed = true
```

---

## Dashboard Logic
```
4 insight cards (each links to filtered page):
  Séances aujourd'hui → sessions WHERE date=today (Africa/Casablanca)
  Alertes paiements   → students WHERE overdue (remaining > 0 + days > 14)
  Prêts pour examen   → students WHERE status=exam_ready
  Dossiers incomplets → students WHERE missing required docs

"À traiter" column — ranked by urgency:
  1. overdue payments (days_since_payment DESC)
  2. incomplete dossiers
  3. exam_ready waiting for scheduling

Date navigator: prev/next day arrows on session list
End of day summary: sessions completed + payments received + total MAD
```

---

## Moroccan-Specific Rules
```
CIN validation:   /^[A-Z]{1,2}[0-9]{5,6}$/i
Permis types:     B, C, D, EC, A, A1
Payment methods:  cash, bank_transfer, check, ccp, other
Timezone:         Africa/Casablanca (UTC+1, UTC+0 in winter)
Agrement number:  required on all PDFs
NARSA number:     per exam, optional
Code exam:        must pass BEFORE driving exam allowed
Receipt format:   REC-{YEAR}-{0001} — sequential per school, resets yearly
Arabic name:      stored as full_name_arabic, used in contract PDF
```

---

## Moroccan Public Holidays (pre-loaded, block scheduling)
```
Jan 1   — Nouvel An
Jan 11  — Manifeste de l'indépendance
May 1   — Fête du Travail
Jul 30  — Fête du Trône
Aug 14  — Allégeance Oued Eddahab
Aug 20  — Révolution du Roi et du Peuple
Aug 21  — Fête de la Jeunesse
Nov 6   — Marche Verte
Nov 18  — Fête de l'Indépendance
+ Eid Al-Fitr (2 days), Eid Al-Adha (2 days),
  Awal Muharram, Aid Al-Mawlid (dates vary yearly)
```

---

## CSV/Excel Import Flow
```
1. Upload CSV or Excel file (papaparse / SheetJS dynamic import)
2. Auto-detect columns → show mapping UI
   System guesses: full_name, phone, cin, date_of_birth, permis_type, address
   User confirms or corrects mapping
3. Validation preview per row:
   ✅ Ready
   ⚠️ CIN format invalid — will import flagged
   ⚠️ Phone missing — will import flagged
   ❌ Name missing — cannot import
4. Duplicate detection: same CIN or same phone already exists → skip + warn
5. Import → results: "47 imported, 3 skipped, 5 flagged"
6. Flagged students show banner: "Importé — vérification requise"
```

---

## PDF Requirements

### Receipt PDF
```
School name + agrement number + logo
Receipt number: REC-{YEAR}-{0001}
Student name + CIN
Amount + date + payment method
"Reçu par" signature line
```

### Contract PDF
```
School name + agrement number
Student full_name + full_name_arabic + CIN
Date of birth + address
Permis type + total sessions + total price
Payment schedule
Signature lines (school + student)
Arabic font: Amiri or Cairo (embedded)
```

---

## WhatsApp Quick Actions
```
Student phone: wa.me/212{phone} link
Session reminder: wa.me/212{phone}?text=Bonjour+{name},+rappel+de+votre+séance+demain+à+{time}.
Payment receipt: wa.me/212{phone}?text=Reçu+votre+paiement+de+{amount}+MAD+le+{date}.+Merci.
All: URL-encoded, opens WhatsApp directly, user sends manually
```

---

## Super Admin Features
```
Business overview: total schools, total students, active schools, Starter vs Pro count
School detail: info + subscription (trial/active/expired/suspended) + notes + log + limits
Login history: last 10 per user (ip, user_agent, timestamp)
Suspicious flag: 2 different IPs same day → flag in UI
Active indicator: green dot if logged in within 24h
Wilaya filter: filter schools by city/wilaya
Subscription actions: activate, trial, suspend, expire, reactivate → SubscriptionLog entry
```

---

## API Route Rules
```
Every route uses withAuth() or withAdminAuth() wrapper
school_id from session — never from request body
Zod validation on every POST/PATCH — return 400 with field errors
Soft delete: deleted_at = now() — never hard delete
Plan limits checked before every insert
ActivityLog on every important action
Decimal → Number() before returning to client
admin cannot modify School entity → 403
```

---

## Security Rules
```
school_id from session only — never from request body
withAuth(handler) wrapper on every API route
withAdminAuth(handler) for super admin routes
No hardcoded secrets
postinstall: "prisma generate"
```

---

## Demo Accounts
```
admin@autoecole.ma   / Admin1234! → super_admin
atlas@autoecole.ma   / Admin1234! → Auto-École Atlas, Casablanca, Pro active
etoile@autoecole.ma  / Admin1234! → Auto-École Étoile, Rabat, Starter trial (5 days)
sahara@autoecole.ma  / Admin1234! → Auto-École Sahara, Marrakech, Starter expired
```

### Seed Data (Atlas school)
```
8 students: varied statuses, payments, doc completeness
2 instructors: different permis authorizations
20 sessions: mix of completed/scheduled/missed
8 payments: some overdue
3 exams: mix of results
2 expenses
2 waiting list entries
```

---

## Environment Variables
```
DATABASE_URL=
DIRECT_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
NEXT_PUBLIC_APP_URL=
```
