import { db } from "@/drizzle/db";
import {
  JobListingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schema";
import { applicantRankingAgent } from "@/services/inngest/ai/applicationRankingAgent";
import { inngest } from "@/services/inngest/client";
import { and, eq } from "drizzle-orm";

export const rankingApplication = inngest.createFunction(
  {
    name: "Ranking Application",
    id: "ranking-application",
  },
  {
    event: "app/jobListingApplication.created",
  },
  async ({ event, step }) => {
    const { jobListingId, userId } = event.data;

    const coverLetter = await step.run("get-cover-letter", async () => {
      const application = await db.query.JobListingApplicationTable.findFirst({
        where: and(
          eq(JobListingApplicationTable.jobListingId, jobListingId),
          eq(JobListingApplicationTable.userId, userId)
        ),
        columns: {
          coverLetter: true,
        },
      });
      return application;
    });

    const resume = await step.run("get-resume", async () => {
      const resume = await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
          aiSummary: true,
        },
      });
      return resume;
    });

    const jobListing = await step.run("get-job-listing", async () => {
      const jobListing = await db.query.JobListingTable.findFirst({
        where: eq(JobListingTable.id, jobListingId),
        columns: {
          id: true,
          title: true,
          description: true,
          experienceLevel: true,
          locationRequirement: true,
          stateAbbreviation: true,
          wage: true,
          wageInterval: true,
          type: true,
        },
      });
      return jobListing;
    });

    if (!coverLetter || !resume || !jobListing) {
      return;
    }

    await applicantRankingAgent.run(
      JSON.stringify({ coverLetter, resume, jobListing, userId })
    );
  }
);
