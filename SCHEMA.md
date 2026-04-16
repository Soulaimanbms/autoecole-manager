# SCHEMA.md — Auto-École Manager
> Prisma schema + computed fields. Read when doing DB or API work.

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Role               { super_admin admin }
enum PermisType         { B C D EC A A1 }
enum SubscriptionStatus { trial active expired suspended }
enum PlanName           { Starter Pro }
enum StudentStatus      { enrolled in_training exam_ready passed failed archived }
enum SessionStatus      { scheduled completed cancelled missed }
enum SessionType        { code conduite }
enum ExamType           { code driving }
enum ExamResult         { pending passed failed }
enum PaymentMethod      { cash bank_transfer check ccp other }
enum DocumentType       { cin photo medical form_demande acte_naissance contrat }
enum ExpenseCategory    { fuel maintenance salary rent other }

model School {
  id                  String             @id @default(cuid())
  name                String
  city                String
  wilaya              String?
  address             String?
  email               String?
  phone               String
  owner_name          String
  agrement_number     String?
  logo_url            String?
  plan_name           PlanName           @default(Starter)
  subscription_status SubscriptionStatus @default(trial)
  trial_ends_at       DateTime?
  expires_at          DateTime?
  authorized_permis   PermisType[]
  closing_days        DateTime[]
  admin_notes         String?
  receipt_sequence    Int                @default(0)
  deleted_at          DateTime?
  created_at          DateTime           @default(now())
  updated_at          DateTime           @updatedAt

  users            User[]
  students         Student[]
  instructors      Instructor[]
  sessions         Session[]
  payments         Payment[]
  exams            Exam[]
  documents        StudentDocument[]
  expenses         Expense[]
  waitingList      WaitingList[]
  activityLogs     ActivityLog[]
  subscriptionLogs SubscriptionLog[]

  @@index([subscription_status])
}

model User {
  id            String    @id @default(cuid())
  school_id     String?
  email         String    @unique
  password_hash String
  role          Role      @default(admin)
  full_name     String
  status        String    @default("active")
  last_login_at DateTime?
  deleted_at    DateTime?
  created_at    DateTime  @default(now())

  school           School?           @relation(fields: [school_id], references: [id])
  activityLogs     ActivityLog[]
  subscriptionLogs SubscriptionLog[] @relation("ChangedBy")
  loginLogs        LoginLog[]

  @@index([email])
  @@index([school_id])
}

model LoginLog {
  id           String   @id @default(cuid())
  user_id      String
  school_id    String?
  ip_address   String?
  user_agent   String?
  created_at   DateTime @default(now())

  user User @relation(fields: [user_id], references: [id])

  @@index([user_id, created_at])
}

model Student {
  id                      String        @id @default(cuid())
  school_id               String
  full_name               String
  full_name_arabic        String?
  phone                   String
  cin                     String?
  address                 String?
  date_of_birth           DateTime?
  enrollment_date         DateTime      @default(now())
  permis_type             PermisType    @default(B)
  status                  StudentStatus @default(enrolled)
  total_sessions_required Int           @default(20)
  completed_sessions      Int           @default(0)
  total_price             Decimal       @db.Decimal(10, 2)
  photo_url               String?
  notes                   String?
  last_session_at         DateTime?
  last_payment_at         DateTime?
  code_exam_passed        Boolean       @default(false)
  narsa_number            String?
  deleted_at              DateTime?
  created_at              DateTime      @default(now())

  school    School            @relation(fields: [school_id], references: [id])
  sessions  Session[]
  payments  Payment[]
  exams     Exam[]
  documents StudentDocument[]

  @@index([school_id, status])
  @@index([deleted_at])
}

model WaitingList {
  id          String     @id @default(cuid())
  school_id   String
  full_name   String
  phone       String
  permis_type PermisType @default(B)
  notes       String?
  deleted_at  DateTime?
  created_at  DateTime   @default(now())

  school School @relation(fields: [school_id], references: [id])

  @@index([school_id])
}

model Instructor {
  id                  String       @id @default(cuid())
  school_id           String
  full_name           String
  phone               String
  cin                 String?
  license_number      String?
  authorized_permis   PermisType[]
  availability        Json?
  status              String       @default("active")
  deleted_at          DateTime?
  created_at          DateTime     @default(now())

  school   School    @relation(fields: [school_id], references: [id])
  sessions Session[]

  @@index([school_id])
}

model Session {
  id               String        @id @default(cuid())
  school_id        String
  student_id       String
  instructor_id    String
  type             SessionType   @default(conduite)
  date             DateTime
  start_time       String
  duration_minutes Int           @default(60)
  status           SessionStatus @default(scheduled)
  notes            String?
  is_recurring     Boolean       @default(false)
  recurring_weeks  Int?
  deleted_at       DateTime?
  created_at       DateTime      @default(now())

  school     School     @relation(fields: [school_id], references: [id])
  student    Student    @relation(fields: [student_id], references: [id])
  instructor Instructor @relation(fields: [instructor_id], references: [id])

  @@index([school_id, date])
  @@index([student_id])
  @@index([deleted_at])
}

model Payment {
  id             String        @id @default(cuid())
  school_id      String
  student_id     String
  amount         Decimal       @db.Decimal(10, 2)
  payment_date   DateTime      @default(now())
  method         PaymentMethod @default(cash)
  reference      String?
  notes          String?
  receipt_number String?
  deleted_at     DateTime?
  created_at     DateTime      @default(now())

  school  School  @relation(fields: [school_id], references: [id])
  student Student @relation(fields: [student_id], references: [id])

  @@index([school_id, payment_date])
  @@index([student_id])
}

model Exam {
  id              String     @id @default(cuid())
  school_id       String
  student_id      String
  type            ExamType
  scheduled_date  DateTime
  result          ExamResult @default(pending)
  attempt_number  Int        @default(1)
  narsa_number    String?
  narsa_registered Boolean   @default(false)
  notes           String?
  deleted_at      DateTime?
  created_at      DateTime   @default(now())

  school  School  @relation(fields: [school_id], references: [id])
  student Student @relation(fields: [student_id], references: [id])

  @@index([school_id])
  @@index([student_id])
}

model StudentDocument {
  id          String       @id @default(cuid())
  student_id  String
  school_id   String
  type        DocumentType
  file_url    String
  file_name   String
  file_size   Int
  uploaded_at DateTime     @default(now())
  deleted_at  DateTime?

  student Student @relation(fields: [student_id], references: [id])
  school  School  @relation(fields: [school_id], references: [id])

  @@index([student_id])
}

model Expense {
  id           String          @id @default(cuid())
  school_id    String
  category     ExpenseCategory
  amount       Decimal         @db.Decimal(10, 2)
  description  String?
  expense_date DateTime        @default(now())
  deleted_at   DateTime?
  created_at   DateTime        @default(now())

  school School @relation(fields: [school_id], references: [id])

  @@index([school_id, expense_date])
}

model ActivityLog {
  id          String   @id @default(cuid())
  school_id   String
  user_id     String
  action      String
  entity_type String?
  entity_id   String?
  created_at  DateTime @default(now())

  school School @relation(fields: [school_id], references: [id])
  user   User   @relation(fields: [user_id], references: [id])

  @@index([school_id, created_at])
}

model SubscriptionLog {
  id         String   @id @default(cuid())
  school_id  String
  changed_by String
  action     String
  note       String?
  created_at DateTime @default(now())

  school School @relation(fields: [school_id], references: [id])
  user   User   @relation("ChangedBy", fields: [changed_by], references: [id])

  @@index([school_id])
}
```

---

## Computed Fields (never store in DB)

```
amount_paid        = SUM(payments.amount) WHERE student_id AND NOT deleted
remaining_balance  = total_price - amount_paid
remaining_sessions = total_sessions_required - completed_sessions
progress_pct       = (completed_sessions / total_sessions_required) * 100
attempt_number     = COUNT(exams WHERE student_id AND type) + 1
days_since_payment = differenceInDays(today, last_payment_at) [Africa/Casablanca]
dossier_complete   = has cin + medical + contrat uploaded (not deleted)
missing_docs       = required types not in uploaded list
payment_status     = computed from remaining_balance + days_since_payment
```

---

## Required Documents
```
REQUIRED (3): cin, medical, contrat
OPTIONAL (3): photo, form_demande, acte_naissance
```

---

## Plan Limits
```
Starter: max 50 students, max 5 instructors, no document upload
Pro:     unlimited students, unlimited instructors, document upload enabled
```

---

## Prisma Middleware (lib/prisma.ts)
Must intercept ALL of: findMany, findFirst, findUnique
Appends: { where: { deleted_at: null } }

---

## Key Indexes
```
Student:     [school_id, status] + [deleted_at]
Session:     [school_id, date]   + [deleted_at]
Payment:     [school_id, payment_date]
LoginLog:    [user_id, created_at]
ActivityLog: [school_id, created_at]
```
