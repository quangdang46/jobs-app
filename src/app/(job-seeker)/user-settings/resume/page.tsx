import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DropzoneClient from "@/app/(job-seeker)/user-settings/resume/_DropzoneClient";
import React, { Suspense } from "react";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResumes";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { BrainCircuitIcon, FileUserIcon } from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <FileUserIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Resume Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload and manage your resume for job applications
          </p>
        </div>
        
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">Upload Resume</CardTitle>
            <CardDescription>
              Upload a PDF version of your resume to apply for jobs
            </CardDescription>
          </CardHeader>
        <CardContent>
          <DropzoneClient />
        </CardContent>
        <Suspense>
          <ResumeDetails />
        </Suspense>
      </Card>
      
      <Suspense>
        <AISummaryCard />
      </Suspense>
      </div>
    </div>
  );
}

async function ResumeDetails() {
  const { userId } = await getCurrentUser();

  if (!userId) {
    return notFound();
  }

  const resume = await getUserResume(userId);
  if (!resume) {
    return null;
  }

  return (
    <CardFooter className="pt-6 border-t">
      <Button asChild className="w-full">
        <Link href={resume.resumeFileUrl} target="_blank" rel="noreferrer">
          <FileUserIcon className="w-4 h-4 mr-2" />
          View Resume
        </Link>
      </Button>
    </CardFooter>
  );
}

async function AISummaryCard() {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return notFound();
  }

  const resume = await getUserResume(userId);
  if (!resume || !resume.aiSummary) {
    return null;
  }

  return (
    <Card className="shadow-xl border-2 border-primary/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <BrainCircuitIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Resume Summary</CardTitle>
        <CardDescription>
              AI-generated insights from your resume
        </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        <MarkdownRenderer source={resume.aiSummary} />
      </CardContent>
    </Card>
  );
}

async function getUserResume(userId: string) {
  "use cache";
  cacheTag(getUserResumeIdTag(userId));

  const resume = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
  return resume;
}
