// lib/get-current-user.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUserWithProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const [userProfile] = await db
    .select()
    .from(profile)
    .where(eq(profile.authUserId, session.user.id));

  return {
    ...session,
    profile: userProfile ?? null,
  };
}
