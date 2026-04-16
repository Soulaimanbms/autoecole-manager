# DESIGN.md — Auto-École Manager
> UI source of truth. Read this before touching any component or page.
> No prose — just tokens, values, rules.

---

## Design Identity
Clean, modern, confident. Inspired by Oripio/Recruitify.
Light content area + light sidebar + single green accent.
Everything is readable, spacious, fast.

---

## Color Tokens

```
/* Accent */
--accent:          #22c55e   ← primary green, buttons, active states
--accent-dark:     #16a34a   ← hover, gradient end
--accent-dim:      #dcfce7   ← light green bg for badges
--accent-text:     #15803d   ← text on green bg

/* Surfaces */
--bg-page:         #f4f6f8   ← page canvas
--bg-card:         #ffffff   ← cards
--bg-sidebar:      #ffffff   ← sidebar
--bg-input:        #f8fafc   ← input fields
--bg-hover:        #f1f5f9   ← row hover, nav hover

/* Text */
--text-primary:    #0f172a   ← headings, names, important data
--text-body:       #334155   ← body text, descriptions
--text-muted:      #64748b   ← labels, metadata
--text-faint:      #94a3b8   ← placeholders, timestamps

/* Borders */
--border:          #e2e8f0   ← default border
--border-strong:   #cbd5e1   ← emphasized border

/* Semantic */
--success:         #22c55e
--success-bg:      #dcfce7
--success-text:    #15803d

--warning:         #f59e0b
--warning-bg:      #fef3c7
--warning-text:    #92400e

--error:           #ef4444
--error-bg:        #fee2e2
--error-text:      #991b1b

--info:            #3b82f6
--info-bg:         #dbeafe
--info-text:       #1d4ed8
```

### Tailwind Config Names
```
accent / accent-dark / accent-dim / accent-text
bg-page / bg-card / bg-sidebar / bg-input / bg-hover
text-primary / text-body / text-muted / text-faint
border-default / border-strong
success / success-bg / success-text
warning / warning-bg / warning-text
error / error-bg / error-text
info / info-bg / info-text
```

---

## Typography (Inter only — next/font/google)

```
display:   text-3xl  font-extrabold  tracking-tight   ← page heroes
h1:        text-2xl  font-bold       tracking-tight   ← page titles
h2:        text-xl   font-semibold                    ← section titles
h3:        text-base font-semibold                    ← card titles
body:      text-sm   font-normal                      ← standard text
small:     text-xs   font-medium                      ← secondary data
label:     text-[10px] font-semibold uppercase tracking-wider ← column headers, meta
micro:     text-[9px]  font-bold     uppercase tracking-widest ← badges, chips
```

### Rules
- Never pure black — always text-primary (#0f172a)
- Labels always uppercase + tracking-wider
- KPI numbers: text-4xl font-bold
- Student names: text-sm font-semibold
- Timestamps/meta: text-[10px] text-muted uppercase

---

## Spacing

```
page:        p-8 desktop / p-4 mobile
card:        p-6
row:         px-6 py-4 (standard) / px-6 py-5 (with avatar)
section-gap: space-y-8 between major sections
card-gap:    gap-6 between cards
item-gap:    gap-4 inside cards
```

---

## Layout

```
sidebar:      w-60 fixed left-0 top-0 h-screen
main:         ml-60 min-h-screen bg-page
topbar:       h-16 sticky top-0 z-40
content:      max-w-[1400px] mx-auto p-8
```

### Grid
- Dashboard: grid-cols-12
- Cards row: grid-cols-4 (each col-span-3) or grid-cols-3
- Profile: grid-cols-12 (left col-span-4, right col-span-8)

---

## Components

### Sidebar
```
bg-white border-r border-default w-60
padding: p-5
logo area: mb-8
section label: text-[9px] font-bold uppercase tracking-widest text-muted px-3 mb-1 mt-5
nav item inactive: flex items-center gap-3 px-3 py-2 rounded-lg text-text-body text-sm
                   hover:bg-bg-hover hover:text-text-primary transition-all
nav item active:   flex items-center gap-3 px-3 py-2 rounded-lg bg-accent-dim text-accent-text
                   font-semibold border-l-2 border-accent (radius 0 on left side)
icon:              Lucide h-4 w-4
badge count:       ml-auto text-[9px] font-bold bg-bg-hover text-muted px-1.5 py-0.5 rounded-full
bottom section:    mt-auto pt-4 border-t border-default
```

### Topbar
```
h-16 bg-white border-b border-default sticky top-0 z-40
px-8 flex items-center justify-between
left:  page title text-sm font-semibold text-muted uppercase tracking-wider
       + breadcrumb if needed
right: search (rounded-full bg-bg-input border border-default text-xs px-4 py-2)
       + bell icon (relative, red dot if alerts)
       + divider
       + avatar (w-8 h-8 rounded-lg bg-accent-dim text-accent-text font-bold text-xs)
       + school name text-xs text-muted
```

### Cards
```
bg-white rounded-xl border border-default p-6
hover (if interactive): hover:border-border-strong hover:shadow-sm transition-all
NO gradient backgrounds on cards — pure white only
```

### Insight Cards (Dashboard KPIs)
```
bg-white rounded-xl border border-default p-5 cursor-pointer
hover: hover:-translate-y-0.5 hover:shadow-md transition-all duration-200
top: flex justify-between items-start
  left: icon (w-9 h-9 rounded-lg bg-{color}-bg flex items-center justify-center)
  right: trend badge (text-[9px] font-bold)
value: text-3xl font-bold text-primary mt-3
label: text-xs text-muted mt-0.5
bottom: text-[10px] text-muted mt-3 pt-3 border-t border-default
```

### NextActionCard
```
bg-[#0f172a] text-white rounded-xl p-5
label: text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1
action: text-sm font-semibold text-white mb-3
cta: text-[10px] font-bold uppercase tracking-wider text-accent
urgent: small pill bg-accent/10 text-accent text-[9px] font-bold rounded px-2 py-0.5
hover: hover:-translate-y-0.5 transition-all
```

### Student Avatar (SQUARE always)
```
sm:  w-8  h-8  rounded-lg  text-[10px]
md:  w-10 h-10 rounded-xl  text-xs
lg:  w-14 h-14 rounded-xl  text-sm
xl:  w-20 h-20 rounded-2xl text-base
bg-accent-dim text-accent-text font-bold (initials)
object-cover (photo)
```

### Status Badges
```
All: rounded-full text-[9px] font-bold uppercase tracking-wider px-2.5 py-1

enrolled:     bg-info-bg    text-info-text
in_training:  bg-bg-hover   text-muted
exam_ready:   bg-accent-dim text-accent-text
passed:       bg-success-bg text-success-text
failed:       bg-error-bg   text-error-text
archived:     bg-bg-hover   text-faint

paid:         bg-success-bg text-success-text
partial:      bg-warning-bg text-warning-text
overdue:      bg-error-bg   text-error-text
never_paid:   bg-error-bg   text-error-text

scheduled:    bg-info-bg    text-info-text
completed:    bg-success-bg text-success-text
cancelled:    bg-bg-hover   text-muted
missed:       bg-error-bg   text-error-text

code:         bg-info-bg    text-info-text
driving:      bg-accent-dim text-accent-text
pending:      bg-warning-bg text-warning-text
```

### Buttons
```
Primary:
  bg-accent hover:bg-accent-dark text-white
  px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider
  transition-all active:scale-95

Secondary:
  bg-white hover:bg-bg-hover text-text-body border border-default
  px-4 py-2 rounded-lg text-xs font-medium
  transition-all

Ghost (table actions):
  p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary
  opacity-0 group-hover:opacity-100 transition-all

Destructive:
  bg-error hover:bg-red-600 text-white
  px-4 py-2 rounded-lg text-xs font-bold
```

### Inputs
```
w-full px-3 py-2 text-sm
bg-bg-input border border-default rounded-lg
focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none
placeholder:text-faint
transition-all
```

### Table
```
container: bg-white rounded-xl border border-default overflow-hidden
header:    px-6 py-3 border-b border-default bg-bg-page
  cell:    text-[9px] font-bold uppercase tracking-widest text-muted
rows:      divide-y divide-default
row:       px-6 py-4 hover:bg-bg-hover transition-all cursor-pointer group
actions:   opacity-0 group-hover:opacity-100 transition-all
```

### Progress Bar
```
track: h-1.5 w-full bg-bg-hover rounded-full overflow-hidden
fill:  h-full bg-accent rounded-full transition-all duration-500
```

### Filter Pills
```
active:   bg-accent text-white rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider
inactive: bg-white border border-default text-muted rounded-full px-4 py-1.5 text-[10px] font-medium
          hover:border-border-strong hover:text-text-body transition-all
```

### Alert Banner
```
bg-error-bg border border-error/20 rounded-xl p-4
flex items-center gap-4
icon: w-9 h-9 rounded-full bg-error/10 text-error flex items-center justify-center
text: font-semibold text-error-text + text-sm text-error-text/70 mt-0.5
cta:  ml-auto bg-white border border-error/20 text-error-text text-xs font-bold px-3 py-1.5 rounded-lg
```

### Document Slot
```
valid:   flex items-center gap-4 p-4 bg-success-bg/30 rounded-xl border border-success/20
missing: flex items-center gap-4 p-4 bg-error-bg/30 rounded-xl border-dashed border-error/30
icon:    w-10 h-10 rounded-lg (success-bg/text-success or error-bg/text-error)
label:   text-sm font-semibold text-primary
sub:     text-[10px] font-bold uppercase text-muted mt-0.5
```

---

## Login Page

```
Full screen: bg-[#071a2e]
Background layers (back to front):
  1. Moving grid: repeating green lines (opacity 0.03) animate translateY
  2. Radial glow left: rgba(34,197,94,0.07) 500px circle
  3. Radial glow right: rgba(16,185,129,0.05) 400px circle
  4. Floating particles: tiny green dots float upward
  5. Road at bottom: dark overlay + animated dashed markings
  6. 3D car: dark green SVG car, headlight beam, speed lines
  7. Glass card center: see below

Glass card:
  w-[380px] bg-white/4 backdrop-blur-xl
  border border-white/10 rounded-2xl p-8
  shadow: 0 24px 60px rgba(0,0,0,0.5)

Card contents:
  - Logo icon (green gradient rounded-xl) + name + tagline
  - Title "Bienvenue" text-2xl font-bold text-white
  - Subtitle text-xs text-white/40
  - Email input (dark glass style)
  - Password input
  - Remember me + forgot password row
  - Green gradient button with shine sweep animation
  - Stats row: 200+ auto-écoles / 12k+ élèves / 98% satisfaction
```

---

## Animations

```
card hover:     hover:-translate-y-0.5 transition-all duration-200
button active:  active:scale-95
row hover:      hover:bg-bg-hover transition-all duration-150
actions reveal: opacity-0 group-hover:opacity-100 transition-all duration-150
page enter:     animate-in fade-in slide-in-from-bottom-2 duration-300
pulse dot:      animate-pulse (alerts)
progress fill:  transition-all duration-500
login card in:  translateY(16px)→0 + opacity 0→1 cubic-bezier(0.34,1.4,0.64,1)
grid move:      translateY 18s linear infinite
particles:      float upward 6-14s linear infinite random drift
road marks:     translateX 1s linear infinite
btn shine:      left -100% → 200% 3s ease-in-out infinite
```

---

## Lucide Icon Map

```
LayoutDashboard  → Dashboard
Users            → Élèves
Calendar         → Séances
CreditCard       → Paiements
GraduationCap    → Examens
UserCog          → Moniteurs
TrendingDown     → Dépenses
Settings         → Paramètres
LogOut           → Déconnexion
HelpCircle       → Support
Bell             → Notifications
Search           → Search
Plus             → Add
ChevronRight     → Navigate
ChevronLeft      → Navigate back
Eye              → View
Pencil           → Edit
Trash2           → Delete
CheckCircle2     → Success
AlertCircle      → Warning
AlertTriangle    → Error/Urgent
Clock            → Time/Duration
Car              → Session conduite
BookOpen         → Session code
Upload           → Upload doc
Download         → Download PDF
FileText         → Document
Receipt          → Payment
Phone            → Contact
MessageCircle    → WhatsApp
Filter           → Filter
X                → Close
Check            → Confirm
MoreHorizontal   → Actions menu
CalendarDays     → Date picker
ArrowRight       → CTA
```

---

## Rules (Never Break)

1. Avatars are SQUARE (rounded-lg/xl/2xl) — never circular
2. Badges always rounded-full
3. Table action buttons invisible until row hover
4. No pure black — use text-primary (#0f172a)
5. No gradient card backgrounds — cards are pure white
6. No <hr> dividers — use border-t or padding
7. Labels always uppercase + tracking-wider
8. Cards have border border-default — no heavy shadows
9. Sidebar active item has border-l-2 border-accent + bg-accent-dim
10. All color changes via CSS token — never hardcode hex in components
11. section-gap: space-y-8 between major page sections
12. Topbar height: h-16 (64px)
13. Sidebar width: w-60 (240px)
14. Page content: max-w-[1400px] mx-auto p-8
