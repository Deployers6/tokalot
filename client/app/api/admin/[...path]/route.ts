import { NextRequest } from "next/server";
import { proxyRequest, requireAdminAccess } from "@/app/api/_lib/admin-proxy";

export const dynamic = "force-dynamic";

async function handle(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const access = await requireAdminAccess();
  if ("response" in access) return access.response;

  const { path } = await params;
  const segment = path[0];
  let bodyOverride: string | undefined;

  if (
    !["GET", "HEAD"].includes(req.method) &&
    ["delete-user", "patch-user"].includes(segment)
  ) {
    const payload = JSON.parse((await req.text()) || "{}") as Record<string, unknown>;
    bodyOverride = JSON.stringify({ ...payload, adminClerkId: access.userId });
  }

  return proxyRequest(
    req,
    `/api/admin/${path.join("/")}${req.nextUrl.search}`,
    { "x-admin-id": access.userId, "x-role": "ADMIN" },
    bodyOverride,
  );
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
