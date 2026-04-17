import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "./session";

export {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifySessionToken,
};
export type { SessionPayload };

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

function computeRedirect(
  role: string,
  subscriptionStatus: string | null,
  trialEndsAt: Date | null,
): string {
  if (role === "super_admin") return "/admin";
  if (subscriptionStatus === "active") return "/dashboard";
  if (subscriptionStatus === "trial") {
    return trialEndsAt && trialEndsAt > new Date() ? "/dashboard" : "/expired";
  }
  if (subscriptionStatus === "suspended") return "/suspended";
  // expired or unknown
  return "/expired";
}

export interface SignInResult {
  ok: boolean;
  error?: string;
  session?: SessionPayload;
  token?: string;
  redirect?: string;
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<SignInResult> {
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase() },
    include: { school: true },
  });

  if (!user) return { ok: false, error: "Identifiants invalides" };
  if (user.status !== "active") {
    return { ok: false, error: "Compte désactivé" };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { ok: false, error: "Identifiants invalides" };

  const session: SessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    schoolId: user.school_id,
    schoolName: user.school?.name ?? null,
  };

  const token = await signSessionToken(session);

  // Fire-and-forget last login update
  prisma.user
    .update({ where: { id: user.id }, data: { last_login_at: new Date() } })
    .catch(() => {});

  const redirect = computeRedirect(
    user.role,
    user.school?.subscription_status ?? null,
    user.school?.trial_ends_at ?? null,
  );

  return { ok: true, session, token, redirect };
}

export async function writeLoginLog(
  userId: string,
  schoolId: string | null,
  ip: string | null,
  userAgent: string | null,
): Promise<void> {
  await prisma.loginLog.create({
    data: {
      user_id: userId,
      school_id: schoolId,
      ip_address: ip,
      user_agent: userAgent,
    },
  });
}
