import { NextRequest } from "next/server";
import { proxyRequest, requireAdminAccess } from "@/app/api/_lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireAdminAccess();
  if ("response" in access) return access.response;

  const { id } = await params;
  return proxyRequest(req, `/api/admin-section/${id}${req.nextUrl.search}`, {
    "x-admin-id": access.userId,
    "x-role": "ADMIN",
  });
}
