"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function syncUser(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Энд user-ийн мэдээллийг Prisma ашиглан бааз руу хадгалж болно
  // await prisma.user.create({ data: { id: user.id, email: ... } })
}
