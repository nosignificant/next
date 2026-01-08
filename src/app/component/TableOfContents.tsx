"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { extractHeadings } from "../lib/slugify"; 
import type { Post } from "../lib/type";

type TOCProps = { posts: Post[]; selected: string };

export default function TableOfContents({ posts, selected }: TOCProps) {
  const post = posts.find((p) => p.slug === selected);
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    return post ? extractHeadings(post.content) : [];
  }, [post]);

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      const offset = 200; 
      
      const visibleHeadings = headings.filter((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) return false;
                return element.offsetTop <= scrollY + offset;
      });

      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[visibleHeadings.length - 1].id);
      } else if (scrollY === 0) {
         setActiveId(headings[0].id);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (!post || !headings || headings.length === 0) return null;

  return (
    <div className="pl-4 border-l border-neutral-100 text-sm">
      <div className="flex flex-col gap-2">
        {headings.map(({ text, id, level }) => {
          const isActive = activeId === id;

          return (
            <Link
              key={id}
              href={`#${id}`} 
onClick={(e) => {
    e.preventDefault();
    setActiveId(id);

    let element = document.getElementById(id);
    
    if (!element) {
        element = document.getElementById(decodeURIComponent(id));
    }

    if (element) {
        const top = element.offsetTop - 100;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}}
              className={`
                block transition-colors duration-200
                ${level === 2 ? "pl-3" : ""} 
                ${level === 3 ? "pl-6" : ""}
                ${level > 3 ? "pl-9" : ""}
                ${level === 1 ? "font-medium" : ""} 
                ${level >= 3 ? "text-xs mt-0.5" : ""} 
                ${!isActive ? "text-neutral-500 hover:text-black" : "font-medium"}
              `}
              style={{
                color: isActive ? "var(--blue-700)" : undefined
              }}
            >
              {text}
            </Link>
          );
        })}
      </div>
    </div>
  );
}