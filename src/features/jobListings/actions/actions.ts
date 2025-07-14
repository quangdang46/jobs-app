"use server";

import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { jobListingSchema } from "@/features/jobListings/actions/schemas";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import {
  insertJobListing,
  updateJobListing as updateJobListingDb,
  deleteJobListing as deleteJobListingDb,
} from "@/features/jobListings/db/jobListings";
import { hasReachedMaxFeaturedJobListings, hasReachedMaxPublishedJobListings } from "@/features/jobListings/lib/planfeatureHelpers";
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import z from "zod";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (
    orgId == null ||
    !(await hasOrgUserPermission("org:job_listings:create"))
  ) {
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

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (
    orgId == null ||
    !(await hasOrgUserPermission("org:job_listings:update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update this job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const updatedJobListing = await updateJobListingDb(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.jobId}`);
}

async function getJobListing(id: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to update this job listing's status",
  };
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) return error;

  const newStatus = getNextJobListingStatus(jobListing.status);
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  return { error: false };
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message:
      "You don't have permission to update this job listing's featured status",
  };
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) return error;

  const newFeaturedStatus = !jobListing.isFeatured;
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(id, {
    isFeatured: newFeaturedStatus,
  });

  return { error: false };
}


export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  };
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);
  if (jobListing == null) return error;

  if (!(await hasOrgUserPermission("org:job_listings:delete"))) {
    return error;
  }

  await deleteJobListingDb(id);

  redirect("/employer");
}