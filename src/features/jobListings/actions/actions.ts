"use server";

import { jobListingSchema } from "@/features/jobListings/actions/schemas";
import { insertJobListing } from "@/features/jobListings/db/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import z from "zod";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.jobId}`);
}
