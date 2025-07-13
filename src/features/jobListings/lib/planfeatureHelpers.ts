import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";
import { and, count, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function hasReachedMaxFeaturedJobListing() {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return true;

  const count = await getPublishedJobListingsCount(orgId);

  const canPost = await Promise.all([
    hasPlanFeature("post_1_job_listing").then((has) => has && count < 1),
    hasPlanFeature("post_3_job_listings").then((has) => has && count < 3),
    hasPlanFeature("post_15_job_listings").then((has) => has && count < 15),
  ]);

  return !canPost.some(Boolean);
}

async function getFeaturedJobListingsCount(orgId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.isFeatured, true)
      )
    );
  return res?.count ?? 0;
}

async function getPublishedJobListingsCount(orgId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.status, "published")
      )
    );
  return res?.count ?? 0;
}
