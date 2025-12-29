"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { Post } from "../lib/type";

export default function WorkPage() {
  const [works, setWorks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState("All");

  useEffect(() => {
    fetch("/api/work")
      .then((res) => res.json())
      .then((data) => setWorks(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    works.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, [works]);

  const filteredWorks = filterTag === "All"
    ? works
    : works.filter((p) => p.tags.includes(filterTag));

  if (loading) return <div className="p-4 text-neutral-400 text-xs">Loading...</div>;

  return (
    <div className="pb-20">
      {/* 필터 */}
      <div className="mb-12 px-1">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs border transition-all",
                filterTag === tag
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-400 border-neutral-200 hover:border-neutral-400"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

{/* ✅ 개선된 자유 정렬 레이아웃 */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-20 px-4">
        {filteredWorks.map((work) => (
          <div 
            key={work.slug} 
            className="group shrink-0"
            style={{ flex: "0 0 auto" }}
          >
            <Link href={`/${work.slug}`} className="block">
              <div className="relative">
                {work.thumbnail ? (
                  <img
                    src={work.thumbnail}
                    alt={work.slug}
                    className="w-auto h-auto max-w-[80vw] md:max-w-[250px] max-h-[250px] md:max-h-[250px] object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 bg-neutral-100 flex items-center justify-center text-neutral-300 text-[10px]">
                    NO IMAGE
                  </div>
                )}
              </div>
              
              {/* 캡션: 이미지 바로 아래에 정보 표시 */}
              <div className="mt-4 max-w-full">
                <span className="text-[10px] text-black font-mono block opacity-0 group-hover:opacity-100 transition-opacity truncate">
                  {work.slug}
                </span>
                <span className="text-[9px] text-neutral-400 font-mono block opacity-0 group-hover:opacity-100 transition-opacity">
                  {work.publishedAt}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}