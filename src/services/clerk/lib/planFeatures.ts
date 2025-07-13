import { auth } from "@clerk/nextjs/server";

export const planFeatureArray = [
  "post_1_job_listing",
  "post_3_job_listings",
  "post_15_job_listings",
  "unlimited_featured_jobs_listing",
  "1_featured_job_listing",
] as const;

type PlanFeature = (typeof planFeatureArray)[number];

export async function hasPlanFeature(feature: PlanFeature) {
  const { has } = await auth();
  return has({ feature });
}
