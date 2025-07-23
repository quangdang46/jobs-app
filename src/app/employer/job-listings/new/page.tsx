import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import JobListingForm from "@/features/jobListings/components/JobListingForm";

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Create New Job Listing
          </h1>
          <p className="text-muted-foreground text-lg">
            Post a new job opportunity and find the perfect candidate
          </p>
        </div>

        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">Job Details</CardTitle>
            <CardDescription>
              Fill in the information about your job opening
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobListingForm jobListing={null}></JobListingForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
