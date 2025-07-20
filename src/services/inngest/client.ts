import { JobListingApplicationTable, JobListingTable } from "@/drizzle/schema";
import {
  DeletedObjectJSON,
  OrganizationJSON,
  UserJSON,
} from "@clerk/nextjs/server";
import { EventSchemas, Inngest } from "inngest";

type ClerkWebhookData<T> = {
  data: {
    data: T;
    raw: string;
    headers: Record<string, string>;
  };
};

type Events = {
  "clerk/user.created": ClerkWebhookData<UserJSON>;
  "clerk/user.updated": ClerkWebhookData<UserJSON>;
  "clerk/user.deleted": ClerkWebhookData<DeletedObjectJSON>;
  "clerk/organization.created": ClerkWebhookData<OrganizationJSON>;
  "clerk/organization.updated": ClerkWebhookData<OrganizationJSON>;
  "clerk/organization.deleted": ClerkWebhookData<DeletedObjectJSON>;
  "app/jobListingApplication.created": {
    data: {
      jobListingId: string;
      userId: string;
    };
  };
  "app/resume/resume.uploaded": {
    user: {
      userId: string;
    };
  };
  "app/email.daily-user-job-listings": {
    data: {
      aiPrompt?: string;
      jobListings: (Omit<
        typeof JobListingTable.$inferSelect,
        "createdAt" | "postedAt" | "updatedAt" | "status" | "organizationId"
      > & { organizationName: string })[];
    };
    user: {
      email: string;
      name: string;
    };
  };
  "app/email.daily-organization-user-applications": {
    data: {
      applications: (Pick<
        typeof JobListingApplicationTable.$inferSelect,
        "rating"
      > & {
        userName: string;
        organizationId: string;
        organizationName: string;
        jobListingId: string;
        jobListingTitle: string;
      })[];
    };
    user: {
      email: string;
      name: string;
    };
  };
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "jobs-app-inngest",
  schemas: new EventSchemas().fromRecord<Events>(),
});
