import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const SOFT_DELETE_MODELS = new Set([
  "School",
  "User",
  "Student",
  "WaitingList",
  "Instructor",
  "Session",
  "Payment",
  "Exam",
  "StudentDocument",
  "Expense",
]);

function createPrismaClient() {
  const client = new PrismaClient({
    // "warn" only — omit "error" to suppress the transient
    // "Error in PostgreSQL connection: Error { kind: Closed }" noise that
    // Neon emits when idle connections are recycled between serverless requests.
    // Prisma retries these automatically; the log entry is a false alarm.
    log: process.env.NODE_ENV === "development" ? ["warn"] : [],
  });

  // Soft-delete middleware: append { deleted_at: null } to read queries.
  client.$use(async (params, next) => {
    if (
      params.model &&
      SOFT_DELETE_MODELS.has(params.model) &&
      (params.action === "findMany" ||
        params.action === "findFirst" ||
        params.action === "findUnique" ||
        params.action === "count")
    ) {
      if (params.action === "findUnique") {
        params.action = "findFirst";
      }
      params.args = params.args ?? {};
      const existingWhere = params.args.where ?? {};
      if (existingWhere.deleted_at === undefined) {
        params.args.where = { ...existingWhere, deleted_at: null };
      }
    }
    return next(params);
  });

  return client;
}

export const prisma: PrismaClient = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
