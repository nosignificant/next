import Link from "next/link";
import React, { ReactNode } from "react";

type IProps = {
  href: string;
  children: ReactNode;
};

export default function InlineLink({ href, children }: IProps) {
  const isExternal = /^https?:\/\//i.test(href);

  return isExternal ? (
    <div className="hover:bg-gray-100 inline-flex px-1">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-gray-700 underline-none "
      >
        {children}
      </a>
    </div>
  ) : (
    <Link href={href} className="underline">
      {children}
    </Link>
  );
}
