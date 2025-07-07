import { OrganizationList } from "@clerk/nextjs";

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default function Page(props: Props) {
  return <SuspendedPage {...props}></SuspendedPage>;
}

async function SuspendedPage({ searchParams }: Props) {
  const { redirect } = await searchParams;
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
