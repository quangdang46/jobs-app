import JobListingItems from "@/app/(job-seeker)/_shared/JobListingItems";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing opportunities from top companies
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner className="size-8" />
          </div>
        }>
          <JobListingItems searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
