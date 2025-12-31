"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Post } from "../../lib/type";

export default function WorkGrid({ works }: { works: Post[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [lines, setLines] = useState<{ path: string; color: string; tag: string }[]>([]);
  
  const [hoveredTags, setHoveredTags] = useState<string[]>([]);

  const calculateLines = () => {
    if (!containerRef.current || works.length === 0) return;

    const { offsetWidth, offsetHeight } = containerRef.current;
    setSvgSize({ width: offsetWidth, height: offsetHeight });
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: { path: string; color: string; tag: string }[] = [];

    const groups: Record<string, string[]> = {};
    works.forEach((work) => {
      if (!work.tags || work.tags.length === 0) {
        if (!groups["default"]) groups["default"] = [];
        groups["default"].push(work.slug);
      } else {
        work.tags.forEach((tag) => {
          const lowerTag = tag.toLowerCase();
          if (!groups[lowerTag]) groups[lowerTag] = [];
          groups[lowerTag].push(work.slug);
        });
      }
    });

    Object.entries(groups).forEach(([tag, slugs]) => {
      if (slugs.length < 2) return; 

      let pathData = "";
      slugs.forEach((slug, index) => {
        const el = itemRefs.current.get(slug);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - containerRect.left;
        const y = rect.top + rect.height / 2 - containerRect.top;

        if (index === 0) pathData += `M ${x} ${y}`;
        else pathData += ` L ${x} ${y}`;
      });

      if (pathData) {
        newLines.push({
          path: pathData,
          color: `var(--tag-${tag}, var(--tag-default))`,
          tag: tag 
        });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    const timer = setTimeout(calculateLines, 200);
    window.addEventListener("resize", calculateLines);
    return () => {
      window.removeEventListener("resize", calculateLines);
      clearTimeout(timer);
    };
  }, [works]);

  return (
    <div ref={containerRef} className="relative flex flex-wrap items-end gap-x-8 gap-y-5 isolation-isolate">
      
      <svg
        className="absolute top-0 left-0 pointer-events-none -z-10"
        width={svgSize.width}
        height={svgSize.height}
        style={{ overflow: "visible" }}
      >
        {lines.map((line, i) => {
          const isHighlighted = hoveredTags.includes(line.tag);
          
          return (
            <path
              key={i}
              d={line.path}
              fill="none"
              stroke={line.color}
              strokeWidth={isHighlighted ? "2" : "1"}
              strokeOpacity={isHighlighted ? "1" : "0.2"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 ease-in-out"
            />
          );
        })}
      </svg>

      {works.map((work) => (
        <div 
          key={work.slug} 
          ref={(el) => {
            if (el) itemRefs.current.set(work.slug, el);
            else itemRefs.current.delete(work.slug);
          }}
          className="group shrink-0 relative z-10"
          style={{ flex: "0 0 auto" }}
          onMouseEnter={() => setHoveredTags(work.tags?.map(t => t.toLowerCase()) || [])}
          onMouseLeave={() => setHoveredTags([])}
        >
          <Link href={`/${work.slug}`} className="block">
            <div className="relative">
              {work.thumbnail ? (
                <img
                  src={work.thumbnail}
                  alt={work.slug}
                  className="w-auto h-auto max-w-[80vw] md:max-w-[250px] max-h-[250px] md:max-h-[250px] object-contain"
                  onLoad={calculateLines}
                />
              ) : (
                <div className="w-32 h-32 bg-neutral-100 flex items-center justify-center text-neutral-300 text-[10px]">
                  NO IMAGE
                </div>
              )}
            </div>
            <div className="mt-4 max-w-full">
              <span className="text-[10px] text-black font-mono block opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {work.slug}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}