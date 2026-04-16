# COMPONENTS.md — Auto-École Manager
> Component props + usage reference. Read during Phase 1 and UI work.

---

## Shared Components (components/shared/)

### StatusBadge
```tsx
<StatusBadge status="exam_ready" variant="student" />
Props:
  status:  string
  variant: 'student' | 'session' | 'payment' | 'exam'
Style: rounded-full text-[9px] font-bold uppercase tracking-wider px-2.5 py-1
Maps: see DESIGN.md Status Badges section
```

### StudentAvatar
```tsx
<StudentAvatar initials="MA" size="md" />
<StudentAvatar photoUrl="/photo.jpg" size="lg" />
Props:
  initials:  string
  photoUrl?: string
  size:      'sm' | 'md' | 'lg' | 'xl'
Sizes: sm=w-8 h-8 rounded-lg / md=w-10 h-10 rounded-xl /
       lg=w-14 h-14 rounded-xl / xl=w-20 h-20 rounded-2xl
SQUARE always — never circular
```

### ProgressBar
```tsx
<ProgressBar value={65} label="13/20 séances" showPct />
Props:
  value:     number (0-100)
  label?:    string
  showPct?:  boolean
```

### LoadingButton
```tsx
<LoadingButton loading={isSubmitting}>Enregistrer</LoadingButton>
Props:
  loading:   boolean
  children:  ReactNode
  variant?:  'primary' | 'secondary' | 'destructive'
  ...ButtonHTMLAttributes
```

### ConfirmDialog
```tsx
<ConfirmDialog
  title="Supprimer cet élève ?"
  description="Cette action est irréversible."
  onConfirm={handleDelete}
  destructive
  trigger={<button>Supprimer</button>}
/>
Props:
  title:        string
  description:  string
  onConfirm:    () => void
  trigger:      ReactNode
  destructive?: boolean
```

### InsightCard
```tsx
<InsightCard
  label="Séances aujourd'hui"
  value={12}
  subtitle="4 complétées"
  icon={<Calendar />}
  accentColor="blue"
  href="/sessions"
/>
Props:
  label:       string
  value:       number | string
  subtitle?:   string
  icon:        ReactNode
  accentColor: 'green' | 'red' | 'amber' | 'blue'
  href?:       string (makes card clickable)
  trend?:      { value: number, positive: boolean }
```

### NextActionCard
```tsx
<NextActionCard
  action="Programmer l'examen de conduite"
  cta="Programmer"
  urgent
  onCtaClick={() => {}}
/>
Props:
  action:      string
  cta?:        string
  urgent?:     boolean
  onCtaClick?: () => void
Style: dark bg-[#0f172a] card
```

### FilterPills
```tsx
<FilterPills
  options={[
    { label: 'Tous', value: 'all' },
    { label: 'En retard', value: 'overdue', dot: 'error' },
  ]}
  selected="all"
  onSelect={(v) => setFilter(v)}
/>
Props:
  options:  Array<{ label: string, value: string, dot?: 'success'|'warning'|'error' }>
  selected: string
  onSelect: (value: string) => void
```

### DossierStatus
```tsx
<DossierStatus docs={student.documents} />
Props:
  docs: Array<{ type: string, deleted_at: Date | null }>
Shows: "3/3 ✓" or "2/3 — Médical manquant"
```

### PaymentSummary
```tsx
<PaymentSummary
  totalPrice={3000}
  amountPaid={1500}
  remainingBalance={1500}
  paymentStatus="partial"
  onRecordPayment={() => {}}
/>
Props:
  totalPrice:       number
  amountPaid:       number
  remainingBalance: number
  paymentStatus:    'paid' | 'partial' | 'overdue' | 'never_paid'
  onRecordPayment?: () => void
```

### WhatsAppLink
```tsx
<WhatsAppLink phone="0612345678" message="Bonjour..." />
Props:
  phone:    string (Moroccan format, auto-converts to 212)
  message?: string (pre-filled, URL-encoded)
Renders: icon + link, opens wa.me URL
```

### AlertBanner
```tsx
<AlertBanner
  count={3}
  message="élèves en retard de paiement"
  ctaLabel="Voir les impayés"
  onCta={() => {}}
/>
Props:
  count:    number
  message:  string
  ctaLabel: string
  onCta:    () => void
```

### ExamReadinessChecklist
```tsx
<ExamReadinessChecklist student={studentWithComputedFields} />
Props:
  student: StudentWithComputedFields
Checks: sessions ✅, dossier ✅, payment ✅, code exam ✅
```

### DocumentSlot
```tsx
<DocumentSlot
  type="cin"
  label="CIN"
  document={doc}
  onUpload={handleUpload}
  onDelete={handleDelete}
  canUpload={isPro}
/>
Props:
  type:      DocumentType
  label:     string
  document?: StudentDocument
  onUpload:  (file: File) => void
  onDelete:  () => void
  canUpload: boolean
```

### TrialBanner
```tsx
<TrialBanner trialEndsAt={school.trial_ends_at} />
Props:
  trialEndsAt: Date
Shows above topbar when in trial. Amber if > 3 days, red if <= 3 days.
```

### EmptyState
```tsx
<EmptyState
  icon={<Users />}
  title="Aucun élève"
  description="Ajoutez votre premier élève"
  action={{ label: 'Ajouter un élève', onClick: () => {} }}
/>
Props:
  icon:        ReactNode
  title:       string
  description: string
  action?:     { label: string, onClick: () => void }
```

---

## Layout Components (components/shared/)

### AppShell
```tsx
<AppShell schoolName="Atlas" userInitials="MA" subscriptionStatus="active">
  {children}
</AppShell>
Props:
  schoolName:          string
  userInitials:        string
  subscriptionStatus:  SubscriptionStatus
  trialEndsAt?:        Date
  children:            ReactNode
Renders: Sidebar (fixed) + main area + Topbar
Mobile: hamburger → Sheet overlay sidebar
```

### Sidebar
```tsx
Internal to AppShell. Props passed from AppShell.
Nav groups:
  PRINCIPAL: Dashboard, Élèves, Séances, Paiements, Examens
  GESTION:   Moniteurs, Dépenses, Liste d'attente
  COMPTE:    Paramètres, Support, Déconnexion
Bottom: + NOUVEL ÉLÈVE button
```

### Topbar
```tsx
Internal to AppShell.
Left:  page title (from route)
Right: search + bell + avatar + school name
```

### AdminShell
```tsx
<AdminShell userInitials="SA">
  {children}
</AdminShell>
Same structure as AppShell but for super admin.
Sidebar nav: Écoles, Utilisateurs
```

---

## Form Components (components/forms/)

### StudentForm
```tsx
Fields: full_name, full_name_arabic, phone, cin, date_of_birth,
        address, permis_type (select from school.authorized_permis),
        total_sessions_required, total_price, notes
Validation: Zod — cin regex /^[A-Z]{1,2}[0-9]{5,6}$/i
```

### SessionForm
```tsx
Fields: student_id, instructor_id, type (code/conduite),
        date, start_time, duration_minutes (30/45/60/90/120),
        notes, is_recurring, recurring_weeks
Validation: conflict detection warning (not hard block)
Holiday check: warn if date is Moroccan public holiday or school closing day
```

### PaymentForm
```tsx
Fields: student_id (pre-filled if from profile), amount,
        method (cash/bank_transfer/check/ccp/other),
        payment_date, reference, notes
Auto: receipt_number generated server-side
```

### ExamForm
```tsx
Fields: student_id, type (code/driving), scheduled_date,
        narsa_number, narsa_registered, notes
Guard: if type=driving AND student.code_exam_passed=false → show error
       "L'élève doit d'abord passer l'examen code"
```

### InstructorForm
```tsx
Fields: full_name, phone, cin, license_number,
        authorized_permis (multi-select), availability (JSON)
```

### ExpenseForm
```tsx
Fields: category (fuel/maintenance/salary/rent/other),
        amount, description, expense_date
```

---

## Types (types/index.ts)

```typescript
type StudentWithComputedFields = Student & {
  amount_paid:        number
  remaining_balance:  number
  remaining_sessions: number
  progress_pct:       number
  payment_status:     'paid' | 'partial' | 'overdue' | 'never_paid'
  missing_docs:       string[]
  next_action:        { label: string; cta?: string; urgent?: boolean }
  days_since_payment: number
}

type SessionWithRelations = Session & {
  student:    Student
  instructor: Instructor
}

type PaymentWithStudent = Payment & {
  student: Student
}
```

---

## Route-to-Component Map

```
/dashboard          → DashboardPage (Server) → InsightCard × 4, NextActionCard,
                      SessionList with DateNavigator, ATraiterList
/students           → StudentsPage (Server) → FilterPills, ImportButton, Table
/students/[id]      → ProfilePage (Server) → 5 tabs, NextActionCard, StudentAvatar
/sessions           → SessionsPage → WeeklyCalendar + ListView toggle
/payments           → PaymentsPage → AlertBanner, 3 InsightCards, PaymentsTable
/exams              → ExamsPage → ExamTable + ResultBadges
/instructors        → InstructorsPage → InstructorTable + AvailabilityView
/expenses           → ExpensesPage → ExpenseTable + MonthlySummary
/settings           → SettingsPage → 4 tabs
/waiting-list       → WaitingListPage → WaitingTable
/admin              → AdminDashboard → SchoolsTable + BusinessOverview
/admin/schools/[id] → SchoolDetailPage → SubscriptionCard + LoginHistory
/admin/users        → UsersPage → UserTable + LoginIndicators
```
