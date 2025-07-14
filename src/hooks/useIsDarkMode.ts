"use client";
import { useEffect, useState } from "react";

export function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set the initial value after hydration
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const controller = new AbortController();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [isHydrated]);

  return isDarkMode;
}
