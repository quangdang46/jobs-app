import { JobListingTable } from "@/drizzle/schema";
import { OrganizationUserSettingsTable } from "@/drizzle/schema/organizationUserSetting";
import { createdAt, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";

export const OrganizationTable = pgTable("organizations", {
  id: varchar().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  imageUrl: varchar(),
  createdAt,
  updatedAt,
});

export const organizationRelations = relations(
  OrganizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
  })
);
