import React from "react";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { cn } from "@/lib/utils";
import { markdownClassNames } from "@/components/markdown/_MarkdownEditor";
import remarkGfm from "remark-gfm";
export default function MarkdownRenderer({
  className,
  options,
  ...props
}: MDXRemoteProps & { className?: string }) {
  return (
    <div className={cn(className, markdownClassNames)}>
      <MDXRemote
        {...props}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
              ...(options?.mdxOptions?.remarkPlugins ?? []),
            ],
            ...options?.mdxOptions,
          },
        }}
      />
    </div>
  );
}
