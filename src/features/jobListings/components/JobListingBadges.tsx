import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirement,
  formatWage,
} from "@/features/jobListings/lib/format";
import { cn } from "@/lib/utils";
import {
  BanknoteIcon,
  BuildingIcon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import React, { ComponentProps } from "react";

export default function JobListingBadges({
  jobListing: {
    wage,
    wageInterval,
    stateAbbreviation,
    city,
    type,
    experienceLevel,
    locationRequirement,
    isFeatured,
  },
  className,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "wage"
    | "wageInterval"
    | "stateAbbreviation"
    | "city"
    | "type"
    | "experienceLevel"
    | "locationRequirement"
    | "isFeatured"
  >;
  className?: string;
}) {
  const badgeProps = {
    variant: "outline",
    className,
  } satisfies ComponentProps<typeof Badge>;
  
  return (
    <>
      {isFeatured && (
        <Badge
          {...badgeProps}
          className={cn(
            className,
            "border-featured bg-gradient-to-r from-featured/20 to-featured/10 text-featured-foreground font-semibold shadow-sm"
          )}
        >
          <StarIcon className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      )}
      {wage != null && wageInterval != null && (
        <Badge {...badgeProps} className={cn(className, "font-medium")}>
          <BanknoteIcon />
          {formatWage(wage, wageInterval)}
        </Badge>
      )}
      {(stateAbbreviation != null || city != null) && (
        <Badge {...badgeProps} className={cn(className, "font-medium")}>
          <MapPinIcon className="size-10" />
          {formatJobListingLocation({ stateAbbreviation, city })}
        </Badge>
      )}
      <Badge {...badgeProps} className={cn(className, "font-medium")}>
        <BuildingIcon />
        {formatLocationRequirement(locationRequirement)}
      </Badge>
      <Badge {...badgeProps} className={cn(className, "font-medium")}>
        <HourglassIcon />
        {formatJobType(type)}
      </Badge>
      <Badge {...badgeProps} className={cn(className, "font-medium")}>
        <GraduationCapIcon />
        {formatExperienceLevel(experienceLevel)}
      </Badge>
    </>
  );
}
