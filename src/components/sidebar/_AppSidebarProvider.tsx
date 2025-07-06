"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

export default function AppSideBarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="p-2 border-b flex items-center gap-1">
          <SidebarTrigger></SidebarTrigger>
          <span className="text-xl ">Jobs</span>
        </div>
        <div className="flex flex-1">{children}</div>
      </div>
    );
  }

  return children;
}
