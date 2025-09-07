"use client";

import { useMemo } from "react";
import type { Post } from "../lib/type";
import "./home.css";
import Link from "next/link";

type HomeProps = {
  posts: Post[];
  recursion?: number;
  maxDepth?: number;
};

export default function HomeBox({
  posts,
  recursion = 0,
  maxDepth = 8,
}: HomeProps) {
  if (!Array.isArray(posts) || posts.length === 0) return <EmptyBox />;

  if (recursion >= posts.length) return null;

  const current = posts[recursion];

  const putContent = useMemo(() => {
    if (recursion >= maxDepth) return false;
    return Math.random() < 0.5;
  }, [recursion, maxDepth]);

  const isRow = useMemo(() => {
    return Math.floor(Math.random() * 2);
    [recursion];
  });

  function EmptyBox({ isRow }: { isRow: boolean }) {
    const repeatNum = Math.floor(Math.random() * 10);
    return Array.from({ length: repeatNum }).map((_, i) => (
      <div key={i} className="emptyTile">
        a1
      </div>
    ));

    // 사용
  }
  return (
    <div className="split">
      <div className={isRow ? " flex flex-row" : "flex flex-col"}>
        {putContent ? (
          <Link
            className="tile"
            href={`/${current.parent}?slug=${encodeURIComponent(current.slug)}`}
          >
            {current.slug}
          </Link>
        ) : (
          <EmptyBox />
        )}
        <HomeBox posts={posts} recursion={recursion + 1} maxDepth={maxDepth} />
      </div>
    </div>
  );
}
