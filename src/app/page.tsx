import AppSideBarProvider from "@/app/_AppSidebarProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SignedIn, SignedOut } from "@/services/clerk/components/AuthButton";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSideBarProvider>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger></SidebarTrigger>
            <span className="text-xl text-nowrap">Jobs</span>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SignedOut>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={"/sign-in"}>
                        <LogInIcon></LogInIcon>
                        <span>Log in</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SignedOut>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarUserButton></SidebarUserButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>

        <main className="flex-1">ádadd</main>
      </AppSideBarProvider>
    </SidebarProvider>
  );
}
