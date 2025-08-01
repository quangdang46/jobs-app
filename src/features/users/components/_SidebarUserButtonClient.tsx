"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SignOutButton } from "@/services/clerk/components/AuthButton";
import { useClerk } from "@clerk/nextjs";
import {
  ChevronsUpDown,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

type User = {
  name: string;
  imageUrl: string;
  email: string;
};

export function SidebarUserButtonClient({ user }: { user: User }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const { openUserProfile } = useClerk();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <UserInfo {...user}></UserInfo>
          <ChevronsUpDown className="ml-auto group-data-[state=collapsed]:hidden"></ChevronsUpDown>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={4}
        align="end"
        side={isMobile ? "bottom" : "right"}
        className="min-w-64 max-w-80"
      >
        <DropdownMenuLabel className="font-normal p-1">
          <UserInfo {...user}></UserInfo>
        </DropdownMenuLabel>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem
          onClick={() => {
            openUserProfile();
            setOpenMobile(false);
          }}
        >
          <UserIcon className="mr-2" /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/user-settings/notifications"}>
            <SettingsIcon className="mr-2" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator></DropdownMenuSeparator>

        <SignOutButton>
          <DropdownMenuItem>
            <LogOutIcon className="mr-1" /> Logout
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserInfo({ imageUrl, name, email }: User) {
  const nameFallBack = name
    .split(" ")
    .slice(0, 2)
    .map((str) => str[0].toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar className="rounded-lg size-8">
        <AvatarImage src={imageUrl} alt={name}></AvatarImage>
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameFallBack}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{name}</span>
        <span className="text-xs truncate">{email}</span>
      </div>
    </div>
  );
}
