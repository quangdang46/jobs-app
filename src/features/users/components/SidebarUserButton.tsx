import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarUserButtonClient } from "@/features/users/components/_SidebarUserButtonClient";
import { SignOutButton } from "@/services/clerk/components/AuthButton";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { LogOutIcon } from "lucide-react";

export function SidebarUserButton() {
  return <SidebarUserSuspense></SidebarUserSuspense>;
}

export async function SidebarUserSuspense() {
  const { user } = await getCurrentUser({ allData: true });

  if (user == null) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Logout</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return <SidebarUserButtonClient user={user}></SidebarUserButtonClient>;
}
