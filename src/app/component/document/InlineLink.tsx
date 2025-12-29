import Link from "next/link";
import React, { ReactNode } from "react";

type IProps = {
  href: string;
  children: ReactNode;
};

export default function InlineLink({ href, children }: IProps) {
  const isExternal = /^https?:\/\//i.test(href);

  return isExternal ? (
    // ✅ div -> span으로 변경 (Hydration Error 해결)
    <span className="hover:bg-neutral-100 inline-flex items-center rounded px-1 transition-colors">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:text-black transition-colors"
      >
        {children}
      </a>
    </span>
  ) : (
    <Link 
      href={href} 
      className="text-neutral-800 underline decoration-neutral-300 underline-offset-4 hover:bg-neutral-100 transition-colors px-0.5 rounded"
    >
      {children}
    </Link>
  );
}