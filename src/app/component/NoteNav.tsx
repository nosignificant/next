"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NoteNav() {
  const pathname = usePathname();
  
  const links = [
    { name: "note", href: "/note" }, 
     { name: "work", href: "/work" },
  ];

  return (
    <nav className="flex gap-6 text-sm font-medium text-neutral-500">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(
            "hover:text-black transition-colors",
            pathname === link.href && "text-black"
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}