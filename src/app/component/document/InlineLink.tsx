import Link from "next/link";
import React, { ReactNode } from "react";
import clsx from "clsx";

type IProps = {
  href: string;
  children: ReactNode;
};

export default function InlineLink({ href, children }: IProps) {
  const isExternal = /^https?:\/\//i.test(href);

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 underline"
    >
      {children}
    </a>
  ) : (
    <Link href={href} className="underline">
      {children}
    </Link>
  );
}
