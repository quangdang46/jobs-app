import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
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

  const jobListings = await getMostRecentJobListing(orgId);

  if (jobListings.length === 0) {
    redirect("/employer/job-listings/new");
  }

  return (
    <div className="flex flex-col gap-4">
      {jobListings.map((jobListing) => (
        <div className="flex flex-col gap-2" key={jobListing.id}>
          <div className="text-lg font-medium">{jobListing.id}</div>
        </div>
      ))}
    </div>
  );
  // } else {
  //   redirect(`/employer/job-listings/${jobListing.id}`);
  // }
}

async function getMostRecentJobListing(organizationId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(organizationId));
  return await db.query.JobListingTable.findMany({
    where: eq(JobListingTable.organizationId, organizationId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}
