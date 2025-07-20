import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { upsertUserResume } from "@/features/users/db/userResume";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { inngest } from "@/services/inngest/client";
import { uploadthing } from "@/services/uploadthing/client";
import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const customFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  resumeUploader: f(
    {
      pdf: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    },
    { awaitServerData: true }
  )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = await getCurrentUser();

      if (userId === null) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;
      // delete old resume

      const resumeFileKey = await getUserResumeFileKey(userId);

      if (resumeFileKey) {
        // call to delete file from uploadthing database
        await uploadthing.deleteFiles([resumeFileKey]);
        // delete file from database
      }

      await upsertUserResume(userId, {
        resumeFileUrl: file.ufsUrl,
        resumeFileKey: file.key,
      });

      await inngest.send({
        name: "app/resume/resume.uploaded",
        user: {
          userId,
        },
      });

      return { message: "Resume uploaded successfully" };
    }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;

async function getUserResumeFileKey(userId: string) {
  const resume = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
  return resume?.resumeFileKey;
}
