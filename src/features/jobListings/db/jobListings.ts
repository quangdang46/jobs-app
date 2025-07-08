import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { revalidateJobListingsCache } from "@/features/jobListings/db/cache/jobListings";

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert
) {
  const [newListing] = await db
    .insert(JobListingTable)
    .values(jobListing)
    .returning({
      jobId: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingsCache(newListing);
  return newListing;
}
