import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getSession,
  signInWithPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  writeLoginLog,
} from "@/lib/auth";

const signinSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

function getSubpath(req: NextRequest): string {
  const url = new URL(req.url);
  return url.pathname.replace(/^\/api\/auth\/?/, "").replace(/\/$/, "");
}

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

export async function GET(req: NextRequest) {
  const subpath = getSubpath(req);

  if (subpath === "session") {
    const session = await getSession();
    return NextResponse.json({ session });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const subpath = getSubpath(req);

  if (subpath === "signin") {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = signinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await signInWithPassword(
      parsed.data.email,
      parsed.data.password,
    );

    if (!result.ok || !result.token || !result.session) {
      return NextResponse.json(
        { error: result.error ?? "Identifiants invalides" },
        { status: 401 },
      );
    }

    // Fire-and-forget login log (DB might not be seeded in dev)
    writeLoginLog(
      result.session.id,
      result.session.schoolId,
      getClientIp(req),
      req.headers.get("user-agent"),
    ).catch(() => {});

    const res = NextResponse.json({
      ok: true,
      session: result.session,
      redirect: result.redirect,
    });

    res.cookies.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return res;
  }

  if (subpath === "signout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
