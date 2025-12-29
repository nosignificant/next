"use client";

import React, { ComponentPropsWithoutRef } from "react";

export default function BlockCode({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className="bg-neutral-50 !border !border-neutral-200 !text-neutral-600 rounded-md p-4 overflow-x-auto my-6 text-sm font-mono leading-relaxed"
      {...props}
    >
      <code className="!bg-transparent !text-inherit !p-0 border-none">
        {children}
      </code>
    </pre>
  );
}