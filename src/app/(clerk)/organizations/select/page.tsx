import { OrganizationList } from "@clerk/nextjs";
import { Suspense } from "react";

type Props = {
  searchParams: { redirect?: string };
};

export default async function page(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props}></SuspendedPage>
    </Suspense>
  );
}

function SuspendedPage({ searchParams }: Props) {
  const { redirect } = searchParams;
  const redirectUrl = redirect ?? "/employer";

  return (
    <OrganizationList
      hidePersonal
      hideSlug
      skipInvitationScreen
      afterCreateOrganizationUrl={redirectUrl}
      afterSelectPersonalUrl={redirectUrl}
    />
  );
}
