"use client";
import useIsBreakPoint from "@/hooks/useIsBreakPoint";
import React from "react";

export default function IsBreakPoint({
  breakpoint,
  otherwise,
  children,
}: {
  breakpoint: string;
  otherwise: React.ReactNode;
  children: React.ReactNode;
}) {
  const isBreakPoint = useIsBreakPoint(breakpoint);

  return isBreakPoint ? children : otherwise;
}
