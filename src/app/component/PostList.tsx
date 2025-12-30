"use client";

import Link from "next/link";
import type { Post } from "../lib/type";
import Chron from "./Chron";
import clsx from "clsx";

type PostListProps = { 
  posts: Post[]; 
  handleSelected: (slug: string) => void;
  selected?: string;
  currentTag?: string; // ✅ 추가: 현재 선택된 태그 받기
};

export default function PostList({ posts, handleSelected, selected, currentTag }: PostListProps) {
  return (
    <div className="flex flex-col text-sm font-pretendard pr-4">
      {posts.map((post, index) => {
        // 날짜 계산 로직 (기존 동일)
        const currentYear = post.publishedAt.substring(0, 4);
        const currentMonth = post.publishedAt.substring(5, 7);
        const prevPost = posts[index - 1];
        const prevYear = prevPost ? prevPost.publishedAt.substring(0, 4) : null;
        const prevMonth = prevPost ? prevPost.publishedAt.substring(5, 7) : null;
        const showYear = !prevPost || currentYear !== prevYear;
        const showMonth = !prevPost || currentYear !== prevYear || currentMonth !== prevMonth;

        // ✅ 링크 주소 생성 로직 수정
        // 태그가 있으면 주소 뒤에 ?tag=태그명 붙이기
        const href = currentTag 
          ? `/${post.slug}?tag=${currentTag}` 
          : `/${post.slug}`;

        return (
          <Link
            key={post.slug}
            href={href} // ✅ 수정된 주소 사용
            className={clsx(
              "flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md transition-colors",
              "hover:bg-neutral-50",
              selected === post.slug 
                ? "bg-neutral-100 font-medium text-black" 
                : "text-neutral-600"
            )}
            onClick={() => handleSelected(post.slug)} 
          >
            {/* ... 내용 (기존 동일) ... */}
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