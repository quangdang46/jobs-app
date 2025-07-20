"use client";

import LoadingSwap from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { getAISearchJobListings } from "@/features/jobListings/actions/actions";
import { JobListingAISearchFormSchema } from "@/features/jobListings/actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function JobListingAISearchForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(JobListingAISearchFormSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(data: z.infer<typeof JobListingAISearchFormSchema>) {
    const result = await getAISearchJobListings(data);
    if (result.error) {
      toast.error(result.message);
      return;
    }

    const params = new URLSearchParams();
    result.jobIds.forEach((id) => params.append("jobIds", id));
    router.push(`/?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="query"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Query</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-32" />
              </FormControl>
              <FormDescription>
                Provide a description of your skills/experience as well as what
                you are looking for in a job. The more specific you are, the
                better the results will be.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Search
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
