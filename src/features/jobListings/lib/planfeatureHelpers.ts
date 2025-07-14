import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";
import { and, count, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

// export async function hasReachedMaxPublishedJobListings() {
//   const { orgId } = await getCurrentOrganization();
//   if (orgId == null) return true;

//   const count = await getPublishedJobListingsCount(orgId);

//   const canPost = await Promise.all([
//     hasPlanFeature("post_1_job_listing").then((has) => has && count < 1),
//     hasPlanFeature("post_3_job_listings").then((has) => has && count < 3),
//     hasPlanFeature("post_15_job_listings").then((has) => has && count < 15),
//   ]);

//   return !canPost.some(Boolean);
// }

// export async function hasReachedMaxFeaturedJobListings() {
//   const { orgId } = await getCurrentOrganization();
//   if (orgId == null) return true;

//   const count = await getFeaturedJobListingsCount(orgId);
//   const canFeature = await Promise.all([
//     hasPlanFeature("1_featured_job_listing").then((has) => has && count < 1),
//     hasPlanFeature("unlimited_featured_jobs_listings"),
//   ]);

//   return !canFeature.some(Boolean);
// }

export async function hasReachedMaxPublishedJobListings() {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return true;

  const count = await getPublishedJobListingsCount(orgId);

  if ((await hasPlanFeature("post_15_job_listings")) && count < 15) {
    return false;
  }
  if ((await hasPlanFeature("post_3_job_listings")) && count < 3) {
    return false;
  }
  if ((await hasPlanFeature("post_1_job_listing")) && count < 1) {
    return false;
  }

  return true;
}

export async function hasReachedMaxFeaturedJobListings() {
  const { orgId } = await getCurrentOrganization();
  console.log("orgId", orgId);
  if (!orgId) return true;

  const count = await getFeaturedJobListingsCount(orgId);
  if (await hasPlanFeature("unlimited_featured_jobs_listings")) {
    return false;
  }

  if ((await hasPlanFeature("1_featured_job_listing")) && count < 1) {

    return false;
  }

  return true;
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
