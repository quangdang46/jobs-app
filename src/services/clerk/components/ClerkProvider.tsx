"use client";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { dark } from "@clerk/themes";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { useEffect, useState } from "react";

export default function ClerkProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useIsDarkMode();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Only apply appearance after hydration to prevent mismatch
  const appearance = isHydrated && isDarkMode ? { baseTheme: dark } : undefined;

  return (
    <OriginalClerkProvider appearance={appearance}>
      {children}
    </OriginalClerkProvider>
  );
}
