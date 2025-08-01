"use client";

import LoadingSwap from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { updateUserNotificationSettings } from "@/features/users/actions/actions";
import { userNotificationSettingsSchema } from "@/features/users/actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function NotificationsForm({
  notificationSettings,
}: {
  notificationSettings?: Pick<
    typeof UserNotificationSettingsTable.$inferSelect,
    "aiPrompt" | "newJobEmailNotifications"
  >;
}) {
  const form = useForm({
    resolver: zodResolver(userNotificationSettingsSchema),
    defaultValues: notificationSettings ?? {
      aiPrompt: null,
      newJobEmailNotifications: false,
    },
  });

  async function onSubmit(
    data: z.infer<typeof userNotificationSettingsSchema>
  ) {
    const result = await updateUserNotificationSettings(data);
    if (result.error) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message ?? "Notification settings updated");
  }

  const newJobEmailNotifications = form.watch("newJobEmailNotifications");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-4 shadow-sm space-y-6">
          <FormField
            name="newJobEmailNotifications"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Daily Email Notifications</FormLabel>
                    <FormDescription>
                      Receive emails about new job listings that match your
                      interests
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          {newJobEmailNotifications && (
            <FormField
              name="aiPrompt"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>Filter Prompt</FormLabel>
                    <FormDescription>
                      Our AI will use this prompt to filter job listings and
                      only send you notifications for jobs that match your
                      criteria.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      className="min-h-32"
                      placeholder="Describe the jobs you're interested in. For example: 'I'm looking for remote frontend development positions that use React and pay at least $100k per year.'"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank to receive notifications of all new job
                    listings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Save Notification Settings
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
