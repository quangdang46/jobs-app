import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { revalidateUserCache } from "@/features/users/db/cache/users";
import { eq } from "drizzle-orm";

export async function insertUser(user: typeof UserTable.$inferInsert) {
  await db.insert(UserTable).values(user).onConflictDoNothing();
  revalidateUserCache(user.id);
}

export async function updateUser(
  id: string,
  user: Partial<typeof UserTable.$inferInsert>
) {
  await db.update(UserTable).set(user).where(eq(UserTable.id, id));
  revalidateUserCache(id);
}

export async function deleteUser(id: string) {
  await db.delete(UserTable).where(eq(UserTable.id, id));
  revalidateUserCache(id);
}
