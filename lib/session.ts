import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "autoecole_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  id: string;
  email: string;
  role: "super_admin" | "admin";
  schoolId: string | null;
  schoolName: string | null;
}

function getSecretKey(): Uint8Array {
  const secret =
    process.env.BETTER_AUTH_SECRET ??
    "dev-secret-do-not-use-in-production-change-me";
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.id === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "super_admin" || payload.role === "admin")
    ) {
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        schoolId:
          typeof payload.schoolId === "string" ? payload.schoolId : null,
        schoolName:
          typeof payload.schoolName === "string" ? payload.schoolName : null,
      };
    }
    return null;
  } catch {
    return null;
  }
}
