import AsyncIf from "@/components/AsyncIf";
import LoadingSwap from "@/components/LoadingSwap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JobListingAISearchForm from "@/features/jobListings/components/JobListingAiSearchForm";
import { SignUpButton } from "@/services/clerk/components/AuthButton";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { BrainCircuitIcon, LogInIcon } from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full shadow-2xl border-2 border-primary/10">
        <AsyncIf
          condition={async () => {
            const { userId } = await getCurrentUser();
            return userId != null;
          }}
          loadingFallback={
            <LoadingSwap isLoading>
              <AICard />
            </LoadingSwap>
          }
          otherwise={<NoPermission />}
        >
          <AICard />
        </AsyncIf>
      </Card>
    </div>
  );
}

function AICard() {
  return (
    <>
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <BrainCircuitIcon className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AI-Powered Job Search
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          This can take a few minutes to process, so please be patient.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <JobListingAISearchForm />
      </CardContent>
    </>
  );
}

function NoPermission() {
  return (
    <CardContent className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
        <LogInIcon className="w-10 h-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Permission Denied</h2>
      <p className="mb-6 text-muted-foreground text-lg">
        You need to create an account before using AI search
      </p>
      <SignUpButton />
    </CardContent>
  );
}
