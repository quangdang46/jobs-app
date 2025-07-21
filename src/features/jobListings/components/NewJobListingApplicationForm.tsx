"use client";

import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormDescription,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import z from "zod";
import LoadingSwap from "@/components/LoadingSwap";
import { toast } from "sonner";
import { newJobListingApplicationSchema } from "@/features/jobListingApplications/actions/schema";
import { useForm } from "react-hook-form";
import { createJobListingApplication } from "@/features/jobListingApplications/actions/actions";

export default function NewJobListingApplicationForm({
  jobListingId,
}: {
  jobListingId: string;
}) {
  const form = useForm({
    resolver: zodResolver(newJobListingApplicationSchema),
    defaultValues: {
      coverLetter: "",
    },
  });

  async function onSubmit(
    data: z.infer<typeof newJobListingApplicationSchema>
  ) {
    const results = await createJobListingApplication(jobListingId, data);

    if (results.error) {
      toast.error(results.message);
      return;
    }

    toast.success(results.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
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
            Apply
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
