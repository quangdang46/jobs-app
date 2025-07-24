import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
  LogInIcon,
  BuildingIcon,
  DollarSignIcon,
  MapPinIcon,
  FolderIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";
import { ReactNode } from "react";

export default function layout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <AppSidebar
      content={
        <>
          {sidebar}
          <SidebarNavMenuGroup
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
              {
                href: "/ai-search",
                icon: <BrainCircuitIcon />,
                label: "AI Search",
              },
              { href: "/categories", icon: <FolderIcon />, label: "Job Categories" },
              { href: "/recently-viewed", icon: <ClockIcon />, label: "Recently Viewed" },
            ]}
          ></SidebarNavMenuGroup>
          <SidebarNavMenuGroup
            title="Search Tools"
            items={[
              { href: "/salary-search", icon: <DollarSignIcon />, label: "Salary Search" },
              { href: "/location-search", icon: <MapPinIcon />, label: "Location Search" },
              { href: "/company-profile", icon: <BuildingIcon />, label: "Company Profiles" },
            ]}
          ></SidebarNavMenuGroup>
          <SidebarNavMenuGroup
            title="Job Management"
            items={[
              { href: "/job-templates", icon: <FileTextIcon />, label: "Job Templates" },
              { href: "/job-expiry", icon: <ClockIcon />, label: "Job Expiry" },
            ]}
          ></SidebarNavMenuGroup>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                href: "/employer",
                icon: <LayoutDashboard />,
                label: "Employer Dashboard",
                authStatus: "signedIn",
              },
              {
                href: "/sign-in",
                icon: <LogInIcon />,
                label: "Sign In",
                authStatus: "signedOut",
              },
            ]}
          ></SidebarNavMenuGroup>
        </>
      }
      footerButton={<SidebarUserButton></SidebarUserButton>}
    >
      {children}
    </AppSidebar>
  );
}
