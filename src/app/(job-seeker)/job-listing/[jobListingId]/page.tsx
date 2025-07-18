import { ClientSheet } from "@/app/(job-seeker)/job-listing/[jobListingId]/_ClientSheet";
import IsBreakPoint from "@/components/IsBreakPoint";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { db } from "@/drizzle/db";
import {
  JobListingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schema";
import { getJobListingApplicationIdTag } from "@/features/jobListingApplications/db/cache/jobListingApplications";
import JobListingBadges from "@/features/jobListings/components/JobListingBadges";
import NewJobListingApplicationForm from "@/features/jobListings/components/NewJobListingApplicationForm";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organizations";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResumes";
import { convertSearchParamsToQueryString } from "@/lib/convertSearchParamsToString";
import { SignUpButton } from "@/services/clerk/components/AuthButton";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { differenceInDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { XIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import React, { Suspense } from "react";
type Props = {
  params: Promise<{ jobListingId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function page({ params, searchParams }: Props) {
  return (
    <ResizablePanelGroup autoSaveId="job-listing-panel" direction="horizontal">
      <ResizablePanel id="left" order={1} defaultSize={60} minSize={30}>
        <div className="p-4 h-screen overflow-y-auto">
          {/* <JobListingItems searchParams={searchParams} params={params} /> */}
        </div>
      </ResizablePanel>
      <IsBreakPoint
        breakpoint="min-width: 1024px"
        otherwise={
          <ClientSheet>
            <SheetContent hideCloseButton className="p-4 overflow-y-auto">
              <SheetHeader className="sr-only">
                <SheetTitle>Job Listing Details</SheetTitle>
              </SheetHeader>
              <Suspense fallback={<LoadingSpinner />}>
                <JobListingDetails
                  searchParams={searchParams}
                  params={params}
                />
              </Suspense>
            </SheetContent>
          </ClientSheet>
        }
      >
        <ResizableHandle withHandle className="mx-2" />
        <ResizablePanel id="right" order={2} defaultSize={40} minSize={30}>
          <div className="p-4 h-screen overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <JobListingDetails params={params} searchParams={searchParams} />
            </Suspense>
          </div>
        </ResizablePanel>
      </IsBreakPoint>
    </ResizablePanelGroup>
  );
}

async function JobListingDetails({ params, searchParams }: Props) {
  const { jobListingId } = await params;
  const jobListing = await getJobListing(jobListingId);

  if (jobListing == null) return notFound();
  const nameInitials = jobListing.organization.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");
  return (
    <div className="space-y-6 @container">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <Avatar className="size-14 @max-md:hidden">
            <AvatarImage
              src={jobListing.organization.imageUrl ?? undefined}
              alt={jobListing.organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {jobListing.title}
            </h1>
            <div className="text-base text-muted-foreground">
              {jobListing.organization.name}
            </div>
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @min-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-4">
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @max-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
            <Button size="icon" variant="outline" asChild>
              <Link
                href={`/?${convertSearchParamsToQueryString(
                  await searchParams
                )}`}
              >
                <span className="sr-only">Close</span>
                <XIcon />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <JobListingBadges jobListing={jobListing} />
        </div>
        <Suspense fallback={<Button disabled>Apply</Button>}>
          <ApplyButton jobListingId={jobListing.id} />
        </Suspense>
      </div>

      <MarkdownRenderer source={jobListing.description} />
    </div>
  );
}

async function ApplyButton({ jobListingId }: { jobListingId: string }) {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            You must be signed in to apply for this job.
          </p>
          <SignUpButton />
        </PopoverContent>
      </Popover>
    );
  }

  const applicants = await getJobListingApplicants({
    jobListingId,
    userId,
  });

  if (applicants != null) {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      numeric: "auto",
      style: "short",
    });

    await connection();

    const difference = differenceInDays(new Date(), applicants.createdAt);

    return (
      <div className="text-muted-foreground text-sm">
        You applied {formatter.format(difference, "days")} ago
      </div>
    );
  }

  const userResume = await getUserResume(userId);

  if (userResume == null) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            You must have a resume to apply for this job.
          </p>
          <Button asChild>
            <Link href="/user-settings/resume">Create Resume</Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Application</DialogTitle>
          <DialogDescription>
            Applying for a job cannot be undone and is something you can only do
            once per job listing.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <NewJobListingApplicationForm jobListingId={jobListingId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function getUserResume(userId: string) {
  "use cache";
  cacheTag(getUserResumeIdTag(userId));

  return await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
}

async function getJobListingApplicants({
  jobListingId,
  userId,
}: {
  jobListingId: string;
  userId: string;
}) {
  "use cache";
  cacheTag(getJobListingApplicationIdTag({ jobListingId, userId }));

  const data = await db.query.JobListingApplicationTable.findFirst({
    where: and(
      eq(JobListingApplicationTable.jobListingId, jobListingId),
      eq(JobListingApplicationTable.userId, userId)
    ),
  });

  return data;
}

async function getJobListing(id: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  const listing = await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published")
    ),
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (listing != null) {
    cacheTag(getOrganizationIdTag(listing.organization.id));
  }

  return listing;
}
