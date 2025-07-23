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
        <div className="p-4 border-b-2 border-primary/10 bg-gradient-to-r from-primary/5 to-transparent flex items-center gap-2 shadow-sm">
          <SidebarTrigger></SidebarTrigger>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Jobs
          </span>
        </div>
        <div className="flex flex-1 bg-gradient-to-br from-background to-muted/10">
          {children}
        </div>
      </div>
    );
  }

  return children;
}
