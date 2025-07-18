import { db } from "@/drizzle/db";
import { JobListingApplicationTable } from "@/drizzle/schema";
import { revalidateJobListingApplicationCache } from "@/features/jobListingApplications/db/cache/jobListingApplications";

export async function insertJobListingApplication(
  application: typeof JobListingApplicationTable.$inferInsert
) {
  await db.insert(JobListingApplicationTable).values(application);

  revalidateJobListingApplicationCache(application);
}
