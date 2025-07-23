import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import NotificationsForm from "@/features/users/components/NotificationsForm";
import { getUserNotificationSettingsIdTag } from "@/features/users/db/cache/userNotificationSettings";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { BellIcon } from "lucide-react";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspendedComponent />
    </Suspense>
  );
}

async function SuspendedComponent() {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <BellIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Notification Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize how you receive job alerts and updates
          </p>
        </div>
        
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl">Email Preferences</CardTitle>
          </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <SuspendedNotificationsForm userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

async function SuspendedNotificationsForm({ userId }: { userId: string }) {
  const notifications = await getNotificationSettings(userId);

  return <NotificationsForm notificationSettings={notifications} />;
}

async function getNotificationSettings(userId: string) {
  "use cache";
  cacheTag(getUserNotificationSettingsIdTag(userId));

  const settings = await db.query.UserNotificationSettingsTable.findFirst({
    where: eq(UserNotificationSettingsTable.userId, userId),
    columns: {
      aiPrompt: true,
      newJobEmailNotifications: true,
    },
  });

  return settings;
}
