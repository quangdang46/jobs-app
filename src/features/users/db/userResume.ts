import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { revalidateUserResumeCache } from "@/features/users/db/cache/userResumes";

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
