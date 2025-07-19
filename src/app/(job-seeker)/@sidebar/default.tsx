import JobBoardSidebar from "@/app/(job-seeker)/_shared/JobBoardSidebar";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobBoardSidebar />
    </Suspense>
  );
}
