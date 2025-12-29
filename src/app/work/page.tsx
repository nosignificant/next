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
      
      {/* 상단: 타이틀 & 필터 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-1">
        <h1 className="text-2xl font-bold">Work</h1>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={clsx(
                "text-xs",
                filterTag === tag ? "font-bold text-black" : "text-neutral-400"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 그리드: 장식 제거, 이미지+텍스트만 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10">
        
        {filteredWorks.map((work) => (
          <Link
            key={work.slug}
            href={`/${work.slug}`}
            className="group block"
          >
            {/* 1. 썸네일 이미지 (단순 사각형) */}
            <div className="aspect-square w-full bg-neutral-100 mb-3 overflow-hidden">
              {work.thumbnail ? (
                <img
                  src={work.thumbnail}
                  alt={work.slug}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">
                  NO IMAGE
                </div>
              )}
            </div>

            {/* 2. 텍스트 정보 (제목 + 연도) */}
            <div className="flex justify-between items-baseline px-1">
              <h2 className="text-sm font-medium text-black decoration-neutral-400 truncate pr-4">
                {work.slug}
              </h2>
              
              <span className="text-xs text-neutral-400 font-mono shrink-0">
                {work.chron?.year || work.publishedAt.substring(0, 4)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredWorks.length === 0 && (
        <div className="py-20 text-center text-neutral-400 text-sm">
          Empty.
        </div>
      )}
    </div>
  );
}