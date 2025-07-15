import JobListingMenuGroup from "@/app/employer/_JobListingMenuGroup";
import AsyncIf from "@/components/AsyncIf";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { db } from "@/drizzle/db";
import {
  JobListingApplicationTable,
  JobListingStatus,
  JobListingTable,
} from "@/drizzle/schema";
import { getJobListingApplicationJobListingTag } from "@/features/jobListingApplications/db/cache/jobListingApplications";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import {
  getNextJobListingStatus,
  sortJobListingsByStatus,
} from "@/features/jobListings/lib/utils";
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { count, desc, eq } from "drizzle-orm";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <EmployerLayout>{children}</EmployerLayout>
    </Suspense>
  );
}

async function EmployerLayout({ children }: { children: ReactNode }) {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return redirect("/organizations/select");
  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job listings</SidebarGroupLabel>
            <AsyncIf
              condition={() => hasOrgUserPermission("org:job_listings:create")}
            >
              <SidebarGroupAction title="Add job listings" asChild>
                <Link href={"/employer/job-listings/new"}>
                  <span className="sr-only">Add job listing</span>
                  <PlusIcon />
                </Link>
              </SidebarGroupAction>
            </AsyncIf>
          </SidebarGroup>
          <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
            <JobListingMenu orgId={orgId} />
          </SidebarGroupContent>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
            ]}
          />
        </>
      }
      footerButton={<SidebarOrganizationButton></SidebarOrganizationButton>}
    >
      {children}
    </AppSidebar>
  );
}

async function JobListingMenu({ orgId }: { orgId: string }) {
  const jobListing = await getJobListing(orgId);
  if (
    jobListing.length == 0 &&
    (await hasOrgUserPermission("org:job_listings:create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={"/employer/job-listings/new"}>
              <PlusIcon />
              <span>Create your first listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  return Object.entries(Object.groupBy(jobListing, (j) => j.status))
    .sort(([a], [b]) => {
      return sortJobListingsByStatus(
        a as JobListingStatus,
        b as JobListingStatus
      );
    })
    .map(([status, jobListings]) => (
      <JobListingMenuGroup
        key={status}
        status={status as JobListingStatus}
        jobListings={jobListings}
      />
    ));
}

async function getJobListing(orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(orgId));

  const data = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      status: JobListingTable.status,
      applicationCount: count(JobListingApplicationTable.userId),
    })
    .from(JobListingTable)
    .where(eq(JobListingTable.organizationId, orgId))
    .leftJoin(
      JobListingApplicationTable,
      eq(JobListingTable.id, JobListingApplicationTable.jobListingId)
    )
    .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
    .orderBy(desc(JobListingTable.createdAt));

  data.forEach((jobListing) => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id));
  });

  return data;
}
