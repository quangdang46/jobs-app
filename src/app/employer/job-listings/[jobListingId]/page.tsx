import AsyncIf from "@/components/AsyncIf";
import MarkdownPartial from "@/components/markdown/MarkdownPartial";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import JobListingBadges from "@/features/jobListings/components/JobListingBadges";
import { formatJobListingStatus } from "@/features/jobListings/lib/format";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { and, eq } from "drizzle-orm";
import { EditIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
type Props = {
  params: Promise<{ jobListingId: string }>;
};

export default function page(props: Props) {
  return <SuspendedPage {...props} />;
}

async function SuspendedPage({
  params,
}: {
  params: Promise<{ jobListingId: string }>;
}) {
  const { orgId } = await getCurrentOrganization();

  const { jobListingId } = await params;
  if (!jobListingId || typeof jobListingId !== "string") {
    throw new Error("Invalid or missing jobListingId");
  }
  if (!orgId || typeof orgId !== "string") {
    throw new Error("Invalid or missing orgId");
  }

  const jobListing = await getJobListing(jobListingId, orgId);
  if (jobListing == null) return notFound();
  return (
    <div className="space-y-6 max-w-6xl max-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <AsyncIf
            condition={() => hasOrgUserPermission("org:job_listings:update")}
          >
            <Button asChild variant={"outline"}>
              <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                <EditIcon className="size-4" />
                Edit
              </Link>
            </Button>
          </AsyncIf>
          <StatusButton></StatusButton>
        </div>
      </div>

      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />
    </div>
  );
}

function StatusButton() {
  return (
    <AsyncIf
      condition={() => hasOrgUserPermission("org:job_listings:change_status")}
    >
      <Button asChild variant={"outline"}>
        <span>Toggle</span>
      </Button>
    </AsyncIf>
  );
}

async function getJobListing(jobListingId: string, orgId: string) {
  "use cache";
  cacheTag();

  return await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, jobListingId),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}
