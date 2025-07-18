import JobListingItems from "@/app/(job-seeker)/_shared/JobListingItems";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="m-4">
      <JobListingItems searchParams={searchParams} />
    </div>
  );
}
