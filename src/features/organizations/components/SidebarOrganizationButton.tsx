import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarOrganizationButtonClient } from "@/features/organizations/components/_SidebarOrganizationButtonClient";
import { SignOutButton } from "@/services/clerk/components/AuthButton";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentUser";
import { LogOutIcon } from "lucide-react";

export function SidebarOrganizationButton() {
  return <SidebarOrganizationSuspense></SidebarOrganizationSuspense>;
}

export async function SidebarOrganizationSuspense() {
  const [{ user }, { organization }] = await Promise.all([
    getCurrentUser({ allData: true }),
    getCurrentOrganization({ allData: true }),
  ]);

  console.log(organization);
  console.log(user);

  if (organization == null || user == null) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Logout</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return (
    <SidebarOrganizationButtonClient
      user={user}
      organization={organization}
    ></SidebarOrganizationButtonClient>
  );
}
