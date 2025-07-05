import { ReactNode, ComponentProps } from "react";

import {
  SignedIn as ClerkSignIn,
  SignedOut as ClerkSignOut,
  SignUpButton as ClerkSignUpButton,
  SignInButton as ClerkSignInButton,
  SignOutButton as ClerkSignOutButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SignedIn({ children }: { children: ReactNode }) {
  return <ClerkSignIn>{children}</ClerkSignIn>;
}

export function SignedOut({ children }: { children: ReactNode }) {
  return <ClerkSignOut>{children}</ClerkSignOut>;
}

export function SignUpButton({
  children = <Button>Sign Up</Button>,
  ...props
}: ComponentProps<typeof ClerkSignOutButton>) {
  return <ClerkSignUpButton {...props}>{children}</ClerkSignUpButton>;
}

export function SignInButton({
  children = <Button>Sign In</Button>,
  ...props
}: ComponentProps<typeof ClerkSignOutButton>) {
  return <ClerkSignInButton {...props}>{children}</ClerkSignInButton>;
}

export function SignOutButton({
  children = <Button>Sign Out</Button>,
  ...props
}: ComponentProps<typeof ClerkSignOutButton>) {
  return <ClerkSignOutButton {...props}>{children}</ClerkSignOutButton>;
}
