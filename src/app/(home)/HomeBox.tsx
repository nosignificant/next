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

  if (recursion >= posts.length) return <EmptyBox />;

  const current = posts[recursion];

  const putContent = useMemo(() => {
    if (recursion >= maxDepth) return false;
    return Math.random() < 0.5;
  }, [recursion, maxDepth]);

  const isRow = useMemo(() => {
    return Math.floor(Math.random() * 2);
    [recursion];
  });

  function EmptyBox() {
    const repeatNum = Math.floor(Math.random() * 5);
    return Array.from({ length: repeatNum }).map((_, i) => (
      <div key={i} className="emptyTile"></div>
    ));

    // 사용
  }
  return (
    <div className="split ">
      <div className={isRow ? " flex flex-row" : "flex flex-col"}>
        {putContent ? (
          <Link
            className="tile"
            href={`/${current.parent}?slug=${encodeURIComponent(current.slug)}`}
          >
            <div className="items-center justify-center"> {current.slug}</div>
          </Link>
        ) : (
          <EmptyBox />
        )}
        <HomeBox posts={posts} recursion={recursion + 1} maxDepth={maxDepth} />
      </div>
    </div>
  );
}
