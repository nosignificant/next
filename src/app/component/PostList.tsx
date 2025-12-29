"use client";

import type { Post } from "../lib/type";
import Chron from "./Chron";
import clsx from "clsx";

type PostListProps = { 
  posts: Post[]; 
  handleSelected: (slug: string) => void;
  selected?: string;
};

export default function PostList({ posts, handleSelected, selected }: PostListProps) {
  return (
    <div className="flex flex-col text-sm font-pretendard pr-4">
      {posts.map((post, index) => {
        // 1. 현재 날짜
        const currentYear = post.publishedAt.substring(0, 4);
        const currentMonth = post.publishedAt.substring(5, 7);

        // 2. 윗 놈(이전 포스트) 날짜 가져오기
        const prevPost = posts[index - 1];
        const prevYear = prevPost ? prevPost.publishedAt.substring(0, 4) : null;
        const prevMonth = prevPost ? prevPost.publishedAt.substring(5, 7) : null;

        // 3. 비교 (윗 놈이랑 다르면 true, 같으면 false)
        // - 첫번째 놈(!prevPost)이면 무조건 보여줌
        const showYear = !prevPost || currentYear !== prevYear;
        const showMonth = !prevPost || currentYear !== prevYear || currentMonth !== prevMonth;

        return (
          <button
            key={post.slug}
            onClick={() => handleSelected(post.slug)}
            className={clsx(
              "flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md transition-colors",
              "hover:bg-neutral-50",
              selected === post.slug 
                ? "bg-neutral-100 font-medium text-black" 
                : "text-neutral-600"
            )}
          >
            {/* 날짜 박스 */}
            <div className="shrink-0 opacity-80 scale-95 origin-left">
               <Chron 
                 {...post} 
                 showYear={showYear} 
                 showMonth={showMonth} 
               />
            </div>

            {/* 제목 */}
            <div className="truncate w-full text-[13px] pt-[1px]">
              {post.slug} 
            </div>
          </button>
        );
      })}
    </div>
  );
}