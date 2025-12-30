"use client";

import { useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import type { Post } from "../lib/type";
import PostList from "./PostList";
import TagFilter from "./TagFilter";

type MobileBottomSheetProps = {
  posts: Post[];         // 전체 posts (필터링 전)
  selected?: string;
  handleSelected: (slug: string) => void;
  tags: string[];
  selectedTag: string;
  onSelect: (tag: string) => void;
};

export default function BottomBar({
  posts,
  selected,
  handleSelected,
  tags,
  selectedTag,
  onSelect,
}: MobileBottomSheetProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);


  const current = useMemo(() => 
    selected ? posts.find((p) => p.slug === selected) : undefined
  , [posts, selected]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag || selectedTag === "All") return posts;
    return posts.filter((post) => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  const onPick = (slug: string) => {
    handleSelected(slug);
    setOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 inset-x-4 z-40 bg-white lg:hidden rounded-2xl shadow-xl border border-neutral-100">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full py-3.5 px-5 text-sm font-medium flex items-center justify-between active:bg-neutral-50 rounded-2xl"
        >
          <span className="truncate flex-1 text-left font-pretendard">
            {current ? current.slug : "목록을 선택하세요"}
          </span>
        </button>
      </div>

      {/* 배경 (Dim) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-50 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 바텀시트 컨테이너 */}
      <div
        id="mobile-post-list"
        className={clsx(
          "fixed inset-x-0 bottom-0 lg:hidden z-[60] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* 상단 핸들 */}
        <div 
          className="flex justify-center py-4 cursor-pointer" 
          onClick={() => setOpen(false)}
        >
          <div className="w-12 h-1.5 bg-neutral-200 rounded-full" />
        </div>

        {/* 태그 필터 영역 */}
        <div className="px-4 pb-4 border-b border-neutral-100">
          <TagFilter 
            tags={tags} 
            selectedTag={selectedTag} 
            onSelect={(tag) => {
              onSelect(tag);
            }} 
          />
        </div>
        
        {/* 포스트 리스트 영역 */}
        <div className="overflow-y-auto px-2 pt-2 pb-10" style={{ maxHeight: "60vh" }}>
          {filteredPosts.length > 0 ? (
            <PostList 
              posts={filteredPosts} 
              selected={selected} 
              handleSelected={onPick}
              currentTag={selectedTag}
            />
          ) : (
            <div className="py-20 text-center text-neutral-400 text-sm">
              해당 태그의 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
}