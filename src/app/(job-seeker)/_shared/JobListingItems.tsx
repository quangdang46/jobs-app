import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import {
  experienceLevels,
  JobListingApplicationTable,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  OrganizationTable,
} from "@/drizzle/schema";
import JobListingBadges from "@/features/jobListings/components/JobListingBadges";
import { getJobListingGlobalTag } from "@/features/jobListings/db/cache/jobListings";
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organizations";
import { convertSearchParamsToQueryString } from "@/lib/convertSearchParamsToString";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import { asc, desc, eq, ilike, or } from "drizzle-orm";
import { and, SQL } from "drizzle-orm";
import { ClipboardListIcon } from "lucide-react";
import { connection } from "next/dist/server/request/connection";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Suspense } from "react";
import { z } from "zod";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params?: Promise<{ jobListingId: string }>;
};

const searchParamsSchema = z.object({
  title: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  state: z.string().optional().catch(undefined),
  experience: z.enum(experienceLevels).optional().catch(undefined),
  locationRequirement: z.enum(locationRequirements).optional().catch(undefined),
  type: z.enum(jobListingTypes).optional().catch(undefined),
  jobIds: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .optional()
    .catch([]),
});

export default function JobListingItems(props: Props) {
  return <SuspendedComponent {...props} />;
}

async function SuspendedComponent({ params, searchParams }: Props) {
  const jobListingId = params ? (await params).jobListingId : undefined;
  const { success, data } = searchParamsSchema.safeParse(await searchParams);
  const search = success ? data : {};
  const jobListings = await getJobListings(search, jobListingId);

  if (jobListings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
          <ClipboardListIcon className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No job listings found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search filters or check back later for new opportunities
        </p>
      </div>
    );
  }

  return (
    <Suspense>
      <div className="grid gap-6">
        {jobListings.map((jobListing) => (
          <Link
            className="block group"
            href={`/job-listing/${
              jobListing.id
            }?${convertSearchParamsToQueryString(search)}`}
            key={jobListing.id}
          >
            <JobListingListItem
              jobListing={jobListing}
              organization={jobListing.organization}
            />
          </Link>
        ))}
      </div>
    </Suspense>
  );
}

function JobListingListItem({
  jobListing,
  organization,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "title"
    | "stateAbbreviation"
    | "city"
    | "wage"
    | "wageInterval"
    | "experienceLevel"
    | "type"
    | "postedAt"
    | "locationRequirement"
    | "isFeatured"
  >;
  organization: Pick<
    typeof OrganizationTable.$inferSelect,
    "name" | "imageUrl"
  >;
}) {
  const nameInitials = organization?.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <Card
      className={cn(
        "@container transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2",
        jobListing.isFeatured 
          ? "border-featured bg-gradient-to-r from-featured/10 to-featured/5 shadow-featured/20" 
          : "hover:border-primary/20"
      )}
    >
      <CardHeader>
        <div className="flex gap-4 items-start">
          <Avatar className="size-16 @max-sm:hidden ring-2 ring-background shadow-lg">
            <AvatarImage
              src={organization.imageUrl ?? undefined}
              alt={organization.name}
            />
            <AvatarFallback className="uppercase bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 flex-1">
            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
              {jobListing.title}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {organization.name}
            </CardDescription>
            {jobListing.postedAt != null && (
              <div className="text-sm font-medium text-primary/80 @min-md:hidden">
                <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                  <DaysSincePosting postedAt={jobListing.postedAt} />
                </Suspense>
              </div>
            )}
          </div>
          {jobListing.postedAt != null && (
            <div className="text-sm font-medium text-primary/80 @max-md:hidden">
              <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                <DaysSincePosting postedAt={jobListing.postedAt} />
              </Suspense>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pt-0">
        <JobListingBadges
          jobListing={jobListing}
          className={cn(
            "transition-all duration-200",
            jobListing.isFeatured ? "border-featured/40 bg-featured/10" : "hover:border-primary/30"
          )}
        />
      </CardContent>
    </Card>
  );
}

async function DaysSincePosting({ postedAt }: { postedAt: Date }) {
  await connection();
  const daysSincePosted = differenceInDays(postedAt, new Date());

  if (daysSincePosted === 0) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
        ✨ New
      </Badge>
    );
  }

  return new Intl.RelativeTimeFormat(undefined, {
    style: "narrow",
    numeric: "always",
  }).format(daysSincePosted, "days");
}

async function getJobListings(
  searchParams: z.infer<typeof searchParamsSchema>,
  jobListingId: string | undefined
) {
  "use cache";
  cacheTag(getJobListingGlobalTag());

  const whereConditions: (SQL | undefined)[] = [];

  if (searchParams.title) {
    whereConditions.push(
      ilike(JobListingTable.title, `%${searchParams.title}%`)
    );
  }

  if (searchParams.locationRequirement) {
    whereConditions.push(
      eq(JobListingTable.locationRequirement, searchParams.locationRequirement)
    );
  }

  if (searchParams.city) {
    whereConditions.push(ilike(JobListingTable.city, `%${searchParams.city}%`));
  }

  if (searchParams.state) {
    whereConditions.push(
      eq(JobListingTable.stateAbbreviation, searchParams.state)
    );
  }

  if (searchParams.experience) {
    whereConditions.push(
      eq(JobListingTable.experienceLevel, searchParams.experience)
    );
  }

  if (searchParams.type) {
    whereConditions.push(eq(JobListingTable.type, searchParams.type));
  }

  if (searchParams.jobIds && searchParams.jobIds.length > 0) {
    whereConditions.push(
      or(...searchParams.jobIds.map((jobId) => eq(JobListingTable.id, jobId)))
    );
  }

  const data = await db.query.JobListingTable.findMany({
    where: or(
      jobListingId
        ? and(
            eq(JobListingApplicationTable.jobListingId, jobListingId),
            eq(JobListingTable.status, "published")
          )
        : undefined,
      and(...whereConditions, eq(JobListingTable.status, "published"))
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
    orderBy: [desc(JobListingTable.postedAt), desc(JobListingTable.isFeatured)],
  });

  data.forEach((listing) => {
    cacheTag(getOrganizationIdTag(listing.organization.id));
  });

  return data;
}
