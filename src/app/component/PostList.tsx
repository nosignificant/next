"use client";

import Link from "next/link";
import type { Post } from "../lib/type";
import Chron from "./Chron";
import clsx from "clsx";

// ✅ Props 타입 정의 (any 삭제)
type PostListProps = { 
  posts: Post[]; 
  handleSelected: (slug: string) => void;
  selected?: string;
  currentTag?: string;
};

export default function PostList({ posts, handleSelected, selected, currentTag }: PostListProps) {
  return (
    <div className="flex flex-col text-sm font-pretendard pr-4">
      {posts.map((post, index) => {
        const currentYear = post.publishedAt.substring(0, 4);
        const currentMonth = post.publishedAt.substring(5, 7);

        const prevPost = posts[index - 1];
        const prevYear = prevPost ? prevPost.publishedAt.substring(0, 4) : null;
        const prevMonth = prevPost ? prevPost.publishedAt.substring(5, 7) : null;

        const showYear = !prevPost || currentYear !== prevYear;
        const showMonth = !prevPost || currentYear !== prevYear || currentMonth !== prevMonth;

        const href = currentTag 
          ? `/${post.slug}?tag=${currentTag}` 
          : `/${post.slug}`;

        return (
          <Link
            key={post.slug}
            href={href}
            onClick={() => handleSelected(post.slug)} 
            className={clsx(
              "flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md transition-colors",
              "hover:bg-neutral-50",
              selected === post.slug 
                ? "bg-neutral-100 font-medium text-black" 
                : "text-neutral-600"
            )}
          >
            <div className="shrink-0 opacity-80 scale-95 origin-left">
               <Chron 
                 {...post} 
                 showYear={showYear} 
                 showMonth={showMonth} 
               />
            </div>

            <div className="truncate w-full text-[13px] pt-[1px]">
              {post.slug} 
            </div>
          </Link>
        );
      })}
    </div>
  );
}