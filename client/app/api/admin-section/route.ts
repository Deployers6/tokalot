import { NextRequest } from "next/server";
import { proxyRequest, requireAdminAccess } from "@/app/api/_lib/admin-proxy";

export const dynamic = "force-dynamic";

async function handle(req: NextRequest) {
  const access = await requireAdminAccess();
  if ("response" in access) return access.response;

  return proxyRequest(req, `/api/admin-section${req.nextUrl.search}`, {
    "x-admin-id": access.userId,
    "x-role": "ADMIN",
  });
}

export const GET = handle;
export const POST = handle;
