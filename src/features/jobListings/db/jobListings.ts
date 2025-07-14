import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { revalidateJobListingsCache } from "@/features/jobListings/db/cache/jobListings";
import { eq } from "drizzle-orm";

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

export async function updateJobListing(
  id: string,
  jobListing: Partial<typeof JobListingTable.$inferInsert>
) {
  const [updatedListing] = await db
    .update(JobListingTable)
    .set(jobListing)
    .where(eq(JobListingTable.id, id))
    .returning({
      jobId: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingsCache(updatedListing);

  return updatedListing;
}

export async function deleteJobListing(id: string) {
  const [deletedJobListing] = await db
    .delete(JobListingTable)
    .where(eq(JobListingTable.id, id))
    .returning({
      jobId: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingsCache(deletedJobListing);

  return deletedJobListing;
}
