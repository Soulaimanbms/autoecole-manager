import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInCalendarDays } from "date-fns";
import { fr } from "date-fns/locale";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatMAD(n: number | null | undefined): string {
  const value = typeof n === "number" && !Number.isNaN(n) ? n : 0;
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} MAD`;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "d MMM yyyy", { locale: fr });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const CASABLANCA_TZ = "Africa/Casablanca";

export function getCasablancaDate(date: Date = new Date()): Date {
  return toZonedTime(date, CASABLANCA_TZ);
}

export function formatCasablanca(date: Date, fmt = "yyyy-MM-dd"): string {
  return formatInTimeZone(date, CASABLANCA_TZ, fmt);
}

export function daysSince(date: Date | string | null | undefined): number {
  if (!date) return Infinity;
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return Infinity;
  return differenceInCalendarDays(
    getCasablancaDate(new Date()),
    getCasablancaDate(d),
  );
}

/**
 * Recursively converts Prisma values (Decimal, Date, BigInt) to plain JSON
 * types so data can safely cross the Server → Client boundary.
 */
export function serialize<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === "bigint") {
    return Number(data) as unknown as T;
  }

  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  // Prisma Decimal duck-type detection
  if (
    typeof data === "object" &&
    data !== null &&
    "toNumber" in data &&
    typeof (data as { toNumber: unknown }).toNumber === "function"
  ) {
    return (data as { toNumber: () => number }).toNumber() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serialize(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      result[key] = serialize(value);
    }
    return result as unknown as T;
  }

  return data;
}
