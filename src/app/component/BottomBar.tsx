"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Post } from "../lib/type";
import PostList from "./PostList";
import TagFilter from "./TagFilter";

type MobileBottomSheetProps = {
  posts: Post[];
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
  tags,         // ✅ 추가됨
  selectedTag,  // ✅ 추가됨
  onSelect,     // ✅ 추가됨
}: MobileBottomSheetProps) {
  const [open, setOpen] = useState(false);

  // 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const current = selected ? posts.find((p) => p.slug === selected) : undefined;

  // 리스트 아이템 클릭 시: 페이지 이동 + 닫기
  const onPick = (slug: string) => {
    handleSelected(slug);
    setOpen(false);
  };

  return (
    <>
      {/* 하단 플로팅 트리거 버튼 */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-200 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full py-4 text-sm font-medium flex items-center justify-center gap-2 active:bg-neutral-50"
          aria-expanded={open}
          aria-controls="mobile-post-list"
        >
          <span className="truncate max-w-[200px]">
            {current ? current.slug : "목록"}
          </span>
        </button>
      </div>

      {/* 딤(배경) - 바텀시트 열렸을 때만 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 바텀시트 */}
      <div
        id="mobile-post-list"
        className={clsx(
          "fixed inset-x-0 bottom-0 lg:hidden z-[60] bg-white rounded-t-xl shadow-2xl overflow-hidden",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ maxHeight: "80vh" }} // 최대 높이 제한
      >
        {/* 헤더 (선택 사항: 닫기 핸들 등) */}
        <div className="flex justify-center pt-3 pb-1" onClick={() => setOpen(false)}>
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>

        <div className="px-4 py-2 border-b border-neutral-50">
          <TagFilter 
            tags={tags} 
            selectedTag={selectedTag} 
            onSelect={onSelect} 
          />
        </div>
        
        {/* ✅ 목록 영역: PostList 컴포넌트 재사용 */}
        {/* PostList에 onPick을 전달하여 클릭 시 닫히도록 함 */}
        <div className="h-full max-h-[60vh] overflow-y-auto px-4 pb-8">
          <PostList 
            posts={posts} 
            selected={selected} 
            handleSelected={onPick} 
          />
        </div>

        {/* 하단 닫기 버튼 (옵션) */}
        <div className="p-4 border-t border-neutral-100 bg-white">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-black text-white py-3 text-sm font-medium rounded-none"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}