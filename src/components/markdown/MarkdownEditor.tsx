import React from "react";
import dynamic from "next/dynamic";

export const MarkdownEditor = dynamic(() => import("./_MarkdownEditor"), {
  ssr: false,
});
