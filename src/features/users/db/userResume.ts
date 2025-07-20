import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { revalidateUserResumeCache } from "@/features/users/db/cache/userResumes";
import { eq } from "drizzle-orm";

export async function upsertUserResume(
  userId: string,
  resume: Omit<typeof UserResumeTable.$inferInsert, "userId">
) {
  await db
    .insert(UserResumeTable)
    .values({ ...resume, userId })
    .onConflictDoUpdate({
      target: [UserResumeTable.userId],
      set: resume,
    });

  revalidateUserResumeCache(userId);
}

export async function updateUserResume(
  userId: string,
  resume: Partial<Omit<typeof UserResumeTable.$inferInsert, "userId">>
) {
  await db
    .update(UserResumeTable)
    .set(resume)
    .where(eq(UserResumeTable.userId, userId));

  revalidateUserResumeCache(userId);
}
