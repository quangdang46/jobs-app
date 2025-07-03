import {
  UserNotificationSettingsTable,
  UserResumeTable,
} from "@/drizzle/schema";
import { OrganizationUserSettingsTable } from "@/drizzle/schema/organizationUserSetting";
import { createdAt, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  imageUrl: varchar().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt,
  updatedAt,
});

export const userRelations = relations(UserTable, ({ one, many }) => ({
  notificationSettings: one(UserNotificationSettingsTable, {
    fields: [UserTable.id],
    references: [UserNotificationSettingsTable.userId],
  }),
  resume: one(UserResumeTable, {
    fields: [UserTable.id],
    references: [UserResumeTable.userId],
  }),
  organizationUserSettings: many(OrganizationUserSettingsTable),
}));
