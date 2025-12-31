import Link from "next/link";
import React, { ReactNode } from "react";

type IProps = {
  href: string;
  children: ReactNode;
};

export default function InlineLink({ href, children }: IProps) {
  const isExternal = /^https?:\/\//i.test(href);

  return isExternal ? (
    <span className="hover:bg-neutral-100 inline-flex items-center rounded transition-colors">
<a 
      href={href} 
      className="transition-opacity hover:opacity-70 underline underline-offset-4 decoration-[0.5px]"
      style={{ color: "var(--blue-700)" }}
    >
      {children}
    </a>
    </span>
  ) : (
    <Link 
      href={href} 
      className="transition-opacity hover:opacity-70 underline underline-offset-4 decoration-[0.5px]"
    >
      {children}
    </Link>
  );
}