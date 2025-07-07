import { OrganizationList } from "@clerk/nextjs";

type Props = {
  searchParams: { redirect?: string };
};

export default function Page(props: Props) {
  return <SuspendedPage {...props}></SuspendedPage>;
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
