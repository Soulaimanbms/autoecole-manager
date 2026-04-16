# SESSION_MESSAGES.md — Auto-École Manager
> Copy the message for your phase. Paste as FIRST message in Claude Code.

---

## Phase 0 — Foundation
```
Read MASTER_PROMPT.md, then PROJECT_CONTEXT.md, then SCHEMA.md from the project root.
Implement Phase 0 from PHASE_PROMPTS.md steps A through L.
Complete every step fully. Run npm run build. Fix all errors.
Done when: atlas@autoecole.ma logs in and reaches a blank dashboard.
```

## Phase 1 — Design System
```
Read MASTER_PROMPT.md, then DESIGN.md, then COMPONENTS.md from the project root.
Implement Phase 1 from PHASE_PROMPTS.md steps A through W.
Every component must match DESIGN.md exactly. Run npm run build.
Done when: /dev/components renders every component correctly.
```

## Phase 2 — App Shell
```
Read MASTER_PROMPT.md, then DESIGN.md, then COMPONENTS.md from the project root.
Implement Phase 2 from PHASE_PROMPTS.md steps A through H.
Run npm run build. Done when: shell + mobile sidebar work on all pages.
```

## Phase 3 — Static Pages
```
Read MASTER_PROMPT.md, then DESIGN.md, then COMPONENTS.md from the project root.
Implement Phase 3 from PHASE_PROMPTS.md steps A through M.
Mock data only — no DB queries. Run npm run build.
Done when: every page renders correctly with mock data.
```

## Phase 4 — Real Data
```
Read MASTER_PROMPT.md, then PROJECT_CONTEXT.md, then SCHEMA.md from the project root.
Implement Phase 4 from PHASE_PROMPTS.md steps A through N.
Server components, Promise.all(), serialize() before clients. No mock data anywhere.
Run npm run build. Done when: every page shows real seed data.
```

## Phase 5 — Write Operations
```
Read MASTER_PROMPT.md, then PROJECT_CONTEXT.md, then SCHEMA.md from the project root.
Implement Phase 5 from PHASE_PROMPTS.md steps A through I.
withAuth() on all routes, Zod validation, plan limits, ActivityLog.
Run npm run build. Done when: full student → session → exam workflow works.
```

## Phase 6 — Intelligence + Files + PDFs
```
Read MASTER_PROMPT.md, then PROJECT_CONTEXT.md, then SCHEMA.md from the project root.
Implement Phase 6 from PHASE_PROMPTS.md steps A through G.
Run npm run build. Done when: PDFs download, uploads work, import works.
```

## Phase 7 — Polish + Deploy
```
Read MASTER_PROMPT.md, then PROJECT_CONTEXT.md, then DESIGN.md from the project root.
Implement Phase 7 from PHASE_PROMPTS.md steps A through H.
Zero errors, zero warnings. Done when: all 4 accounts work in production.
```

---

## Recovery

Build failed:
```
The build failed. Read the full error output. Fix every TypeScript and ESLint error. Run npm run build again. Do not ask.
```

Stopped halfway:
```
Continue from where you stopped. Do not repeat completed steps. Run npm run build when done.
```

Asking questions:
```
All context is in the files listed in this phase. Read them and proceed. Do not ask.
```

UI looks wrong:
```
Read DESIGN.md carefully. Fix every component that doesn't match. Focus on: colors, avatar shape (SQUARE not circle), badge shape (rounded-full), border-radius on cards (rounded-xl), active sidebar item (bg-accent-dim + border-l-2 border-accent).
```

Adding a single feature:
```
Read MASTER_PROMPT.md, DESIGN.md, PROJECT_CONTEXT.md, SCHEMA.md from the project root.
Add this feature: [DESCRIBE CLEARLY].
Rules: withAuth() on API routes, Zod validation, school_id from session,
ActivityLog on important actions, ConfirmDialog on destructive actions,
match DESIGN.md exactly, serialize() before clients.
Run npm run build when done.
```
