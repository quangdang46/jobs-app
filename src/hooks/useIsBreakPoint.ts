import { useEffect, useState } from "react";

export default function useIsBreakPoint(breakpoint: string) {
  const [isBreakPoint, setIsBreakPoint] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const mediaQuery = window.matchMedia(`(${breakpoint})`);

    mediaQuery.addEventListener(
      "change",
      (e) => {
        setIsBreakPoint(e.matches);
      },
      {
        signal: controller.signal,
      }
    );

    setIsBreakPoint(mediaQuery.matches);

    return () => {
      controller.abort();
    };
  }, [breakpoint]);

  return isBreakPoint;
}
