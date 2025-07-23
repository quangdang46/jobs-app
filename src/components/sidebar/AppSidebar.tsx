import AppSideBarProvider from "@/components/sidebar/_AppSidebarProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn } from "@/services/clerk/components/AuthButton";
import { ReactNode } from "react";

export default function AppSidebar({
  content,
  footerButton,
  children,
}: {
  children: ReactNode;
  content: ReactNode;
  footerButton: ReactNode;
}) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSideBarProvider>
        <Sidebar collapsible="icon" className="overflow-hidden border-r-2 border-primary/10">
          <SidebarHeader className="flex-row border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
            <SidebarTrigger></SidebarTrigger>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent text-nowrap">
              Jobs
            </span>
          </SidebarHeader>

          <SidebarContent className="bg-gradient-to-b from-background to-muted/10">
            {content}
          </SidebarContent>

          <SignedIn>
            <SidebarFooter className="border-t border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>

        <main className="flex-1">{children}</main>
      </AppSideBarProvider>
    </SidebarProvider>
  );
}
