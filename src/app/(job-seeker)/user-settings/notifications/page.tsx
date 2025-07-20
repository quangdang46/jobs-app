import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import NotificationsForm from "@/features/users/components/NotificationsForm";
import { getUserNotificationSettingsIdTag } from "@/features/users/db/cache/userNotificationSettings";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <SuspendedNotificationsForm userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
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
