import { Card, CardContent } from "@/components/ui/card";
import JobListingForm from "@/features/jobListings/components/JobListingForm";

export default function page() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">New Job Listing</h1>

      <p className="text-muted-foreground mb-6">This is text</p>
      <Card>
        <CardContent>
          <JobListingForm></JobListingForm>
        </CardContent>
      </Card>
    </div>
  );
}
