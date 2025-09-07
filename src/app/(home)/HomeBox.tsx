"use client";

import { useMemo } from "react";
import type { Post } from "../lib/type";
import "./home.css";
import Link from "next/link";

type HomeProps = {
  posts: Post[];
  recursion?: number;
  maxDepth?: number; // 최대 재귀 깊이 제한
};

export default function HomeBox({
  posts,
  recursion = 0,
  maxDepth = 4,
  handleClick,
}: HomeProps) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  if (recursion >= posts.length) return null;

  const current = posts[recursion];

  // 2) 랜덤 결정은 깊이별로 한 번만 계산해서 유지
  const sliceMore = useMemo(
    () => (recursion > 0 ? Math.random() < 0.5 : true),
    [recursion]
  );

  const putContent = useMemo(() => {
    if (recursion >= maxDepth) return false;
    return Math.random() < 0.5;
  }, [recursion, maxDepth]);

  return (
    <div className="border split">
      {putContent ? (
        <Link
          href={`/${current.parent}?slug=${encodeURIComponent(current.slug)}`}
        >
          {current.slug}
        </Link>
      ) : (
        <div className="h-[40px]" />
      )}
      <HomeBox posts={posts} recursion={recursion + 1} maxDepth={maxDepth} />
    </div>
  );
}
