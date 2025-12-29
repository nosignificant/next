// src/component/ArchiveList.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Chron from "./Chron"; // 경로 확인 필요 (같은 폴더면 ./Chron)
import type { Post } from "../lib/type";

export default function ArchiveList({ posts }: { posts: Post[] }) {
  const [selectedTag, setSelectedTag] = useState("");
  const [isTagExpanded, setIsTagExpanded] = useState(false);

  // 태그 추출 (중복 제거)
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  // 필터링
  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts;

  const visibleTags = isTagExpanded ? allTags : allTags.slice(0, 15);

  return (
    <div className="pt-8 px-4 pb-20 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Archive</h1>

      {/* 태그 필터 영역 */}
      <div className="mb-12 flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setSelectedTag("")}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            selectedTag === ""
              ? "bg-black text-white border-black"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          }`}
        >
          All
        </button>

        {visibleTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              selectedTag === tag
                ? "bg-black text-white border-black"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            #{tag}
          </button>
        ))}

        {allTags.length > 15 && (
          <button
            onClick={() => setIsTagExpanded(!isTagExpanded)}
            className="text-xs text-gray-400 underline ml-2"
          >
            {isTagExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>

      {/* 글 목록 */}
      <div className="flex flex-col gap-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            className="group block border-b border-gray-100 pb-4 last:border-0"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-medium group-hover:underline underline-offset-4 decoration-gray-400">
                {post.slug}
              </h2>
              {/* 날짜 표시 */}
              <div className="shrink-0 opacity-60 scale-90">
                <Chron {...post} />
              </div>
            </div>
            
            <div className="mt-2 flex gap-2">
              {post.tags.map(t => (
                <span key={t} className="text-xs text-gray-400">#{t}</span>
              ))}
            </div>
          </Link>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            {posts.length === 0 
              ? "불러온 글이 없습니다. (경로를 확인해보세요)" 
              : "해당 태그의 글이 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
}