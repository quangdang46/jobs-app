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

export default function Home() {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSideBarProvider>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger></SidebarTrigger>
            <span className="text-xl text-nowrap">Jobs</span>
          </SidebarHeader>
          {/* >
        <SidebarFooter>ddsdsf</SidebarFooter> */}
          <SidebarContent>
            <SidebarGroup>sssss</SidebarGroup>
            <SidebarGroup>sssss</SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>sadasds</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">ádadd</main>
      </AppSideBarProvider>
    </SidebarProvider>
  );
}
