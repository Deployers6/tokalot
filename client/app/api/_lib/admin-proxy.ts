import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://tokalot.vercel.app";

const BODYLESS_METHODS = new Set(["GET", "HEAD"]);
const PASSTHROUGH_HEADERS = ["authorization", "content-type", "x-user-id"];

function getRole(sessionClaims: unknown) {
  if (!sessionClaims || typeof sessionClaims !== "object") return undefined;
  const metadata = (sessionClaims as { metadata?: { role?: string } }).metadata;
  return typeof metadata?.role === "string" ? metadata.role : undefined;
}

export async function requireAdminAccess() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (getRole(sessionClaims) !== "ADMIN") {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { userId };
}

function buildHeaders(req: NextRequest, extraHeaders: Record<string, string>) {
  const headers = new Headers();
  PASSTHROUGH_HEADERS.forEach((name) => {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  });
  Object.entries(extraHeaders).forEach(([name, value]) => headers.set(name, value));
  return headers;
}

export async function proxyRequest(
  req: NextRequest,
  path: string,
  extraHeaders: Record<string, string> = {},
  bodyOverride?: string,
) {
  try {
    const body =
      bodyOverride !== undefined
        ? bodyOverride
        : BODYLESS_METHODS.has(req.method)
          ? undefined
          : await req.text();

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: req.method,
      headers: buildHeaders(req, extraHeaders),
      body: body || undefined,
      cache: "no-store",
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("ADMIN_PROXY_ERROR:", error);
    return NextResponse.json(
      { error: "Admin service unavailable" },
      { status: 502 },
    );
  }
}
