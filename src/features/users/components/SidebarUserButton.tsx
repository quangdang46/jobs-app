import { SidebarUserButtonClient } from "@/features/users/components/_SidebarUserButtonClient";
import { auth } from "@clerk/nextjs/server";

export function SidebarUserButton() {
  return <SidebarUserSuspense></SidebarUserSuspense>;
}

export async function SidebarUserSuspense() {
  const { userId } = await auth();

  return (
    <SidebarUserButtonClient
      user={{ email: "sadasdsa", name: "asdas bbb ccc", imageUrl: "sadadsad" }}
    ></SidebarUserButtonClient>
  );
}
