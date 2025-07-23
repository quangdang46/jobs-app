import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import JobListingForm from "@/features/jobListings/components/JobListingForm";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ jobListingId: string }>;
};

export default function page(props: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Edit Job Listing
          </h1>
          <p className="text-muted-foreground text-lg">
            Update your job listing details and requirements
          </p>
        </div>
        
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">Job Details</CardTitle>
            <CardDescription>
              Modify the information about your job opening
            </CardDescription>
          </CardHeader>
        <CardContent>
          <SuspendedPage {...props} />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

async function SuspendedPage({ params }: Props) {
  const { jobListingId } = await params;
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return notFound();

  const jobListing = await getJobListing(jobListingId, orgId);
  if (jobListing == null) return notFound();

  return <JobListingForm jobListing={jobListing} />;
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
