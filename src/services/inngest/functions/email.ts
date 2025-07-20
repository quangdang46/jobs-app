import { env } from "@/config/env/server";
import { db } from "@/drizzle/db";
import {
  JobListingTable,
  UserNotificationSettingsTable,
} from "@/drizzle/schema";
import { getMatchingJobListings } from "@/services/inngest/ai/getMatchingJobListings";
import { inngest } from "@/services/inngest/client";
import { resend } from "@/services/resend/client";
import DailyJobListingEmail from "@/services/resend/components/DailyJobListingEmail";
import { subDays } from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import { GetEvents } from "inngest";

export const prepareDailyUserJobListingNotifications = inngest.createFunction(
  {
    id: "prepare-daily-user-job-listing-notifications",
    name: "Prepare Daily User Job Listing Notifications",
  },
  {
    cron: "TZ=America/Chicago 0 7 * * *",
  },
  async ({ step, event }) => {
    const users = await step.run("get-user", async () => {
      return await db.query.UserNotificationSettingsTable.findMany({
        where: eq(UserNotificationSettingsTable.newJobEmailNotifications, true),
        columns: {
          userId: true,
          aiPrompt: true,
          newJobEmailNotifications: true,
        },
        with: {
          user: {
            columns: {
              email: true,
              name: true,
            },
          },
        },
      });
    });

    const jobListings = await step.run("get-job-listings", async () => {
      return await db.query.JobListingTable.findMany({
        where: and(
          gte(
            JobListingTable.postedAt,
            subDays(new Date(event.ts ?? Date.now()), 1)
          ),
          eq(JobListingTable.status, "published")
        ),
        columns: {
          createdAt: false,
          postedAt: false,
          updatedAt: false,
          status: false,
          organizationId: false,
        },
        with: {
          organization: {
            columns: {
              name: true,
            },
          },
        },
      });
    });

    if (users.length === 0 || jobListings.length === 0) {
      return;
    }

    const events = users.map((notification) => {
      return {
        name: "app/email.daily-user-job-listings",
        data: {
          aiPrompt: notification.aiPrompt ?? undefined,
          jobListings: jobListings.map((jobListing) => ({
            ...jobListing,
            organizationName: jobListing.organization.name,
          })),
        },
        user: {
          email: notification.user.email,
          name: notification.user.name,
        },
      } as const satisfies GetEvents<
        typeof inngest
      >["app/email.daily-user-job-listings"];
    });

    await step.sendEvent("send-mails", events);
  }
);

export const sendDailyUserJobListingEmail = inngest.createFunction(
  {
    id: "send-daily-user-job-listing-email",
    name: "Send Daily User Job Listing Email",
    throttle: {
      limit: 10,
      period: "1m",
    },
  },
  { event: "app/email.daily-user-job-listings" },
  async ({ step, event }) => {
    const { aiPrompt, jobListings } = event.data;
    const user = event.user;

    if (jobListings.length === 0) return;

    let matchingJobListings: typeof jobListings = [];
    if (aiPrompt == null || aiPrompt.trim() === "") {
      matchingJobListings = jobListings;
    } else {
      const matchingIds = await getMatchingJobListings(aiPrompt, jobListings);
      matchingJobListings = jobListings.filter((listing) =>
        matchingIds.includes(listing.id)
      );
    }

    if (matchingJobListings.length === 0) return;

    await step.run("send-email", async () => {
      await resend.emails.send({
        from: "Job Board <onboarding@resend.dev>",
        to: user.email,
        subject: "Daily Job Listings",
        react: DailyJobListingEmail({
          jobListings,
          userName: user.name,
          serverUrl: env.SERVER_URL,
        }),
      });
    });
  }
);
