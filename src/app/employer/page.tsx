import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getJobListingOrganizationTag } from "@/features/organizations/jobListings/db/cache/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const { orgId } = await getCurrentOrganization();

  if (!orgId) {
    return null;
  }

  const jobListing = await getMostRecentJobListing(orgId);

  if (jobListing == null) {
    redirect("/employer/job-listings/new");
  } else {
    redirect(`/employer/job-listings/${jobListing.id}`);
  }
}

async function getMostRecentJobListing(organizationId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(organizationId));
  return await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, organizationId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}
