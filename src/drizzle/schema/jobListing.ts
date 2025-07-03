import {
  JobListingApplicationTable,
  OrganizationTable,
} from "@/drizzle/schema";
import { createdAt, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const waveIntervals = ["hourly", "yearly"] as const;

export type WaveInterval = (typeof waveIntervals)[number];

export const waveIntervalEnum = pgEnum(
  "job_listings_wave_interval",
  waveIntervals
);

export const locationRequirements = ["in-office", "hybrid", "remote"] as const;
export type LocationRequirement = (typeof locationRequirements)[number];
export const locationRequirementEnum = pgEnum(
  "job_listings_location_requirement",
  locationRequirements
);

export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_listings_experience_level",
  experienceLevels
);

export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export type JobListingStatus = (typeof jobListingStatuses)[number];
export const jobListingStatusEnum = pgEnum(
  "job_listings_status",
  jobListingStatuses
);

export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
] as const;
export type JobListingType = (typeof jobListingTypes)[number];
export const jobListingTypeEnum = pgEnum("job_listings_type", jobListingTypes);

export const JobListingTable = pgTable(
  "job_listings",
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: varchar()
      .references(() => OrganizationTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    title: text().notNull(),
    wave: integer().notNull(),
    waveInterval: waveIntervalEnum(),
    stageAbbreviation: varchar(),
    city: varchar(),
    isFeature: boolean().notNull().default(false),

    locationRequirement: locationRequirementEnum().notNull(),
    status: jobListingStatusEnum().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    type: jobListingTypeEnum().notNull(),
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [index().on(table.stageAbbreviation)]
);

export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    organization: one(OrganizationTable, {
      fields: [JobListingTable.organizationId],
      references: [OrganizationTable.id],
    }),
    applications: many(JobListingApplicationTable),
  })
);
