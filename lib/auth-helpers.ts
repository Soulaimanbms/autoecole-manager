import { NextRequest, NextResponse } from "next/server";
import { getSession, type SessionPayload } from "./auth";

export type AuthedHandler = (
  req: NextRequest,
  ctx: { session: SessionPayload; params?: Record<string, string | string[]> },
) => Promise<Response> | Response;

type RouteContext = { params: Promise<Record<string, string | string[]>> };

export function withAuth(handler: AuthedHandler) {
  return async (req: NextRequest, routeCtx: RouteContext) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = routeCtx?.params ? await routeCtx.params : undefined;
    return handler(req, { session, params });
  };
}

export function withAdminAuth(handler: AuthedHandler) {
  return async (req: NextRequest, routeCtx: RouteContext) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const params = routeCtx?.params ? await routeCtx.params : undefined;
    return handler(req, { session, params });
  };
}
