"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Post } from "../lib/type";
import Chron from "./Chron";

type MobileBottomSheetProps = {
  posts: Post[];
  selected?: string;
  handleSelected: (slug: string) => void;
};

export default function BottomBar({
  posts,
  selected,
  handleSelected,
}: MobileBottomSheetProps) {
  const [open, setOpen] = useState(false);

  // 스크롤 잠금 (선택)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const current = selected ? posts.find((p) => p.slug === selected) : undefined;

  const onPick = (slug: string) => {
    handleSelected(slug);
    setOpen(false);
  };

  return (
    <>
      {/* 하단 플로팅 트리거 버튼 */}
      <div className="fixed bottom-4 inset-x-0 px-4 lg:hidden z-40">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-full bg-black text-white py-3 text-sm shadow-md active:opacity-90"
          aria-expanded={open}
          aria-controls="mobile-post-list"
        >
          {current ? `${current.slug}` : "목록"}
        </button>
      </div>

      {/* 딤(배경) */}
      {open && (
        <button
          className="fixed inset-0 bg-black/30 lg:hidden z-40"
          aria-label="close overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 바텀시트 */}
      <div
        id="mobile-post-list"
        className={clsx(
          "fixed inset-x-0 bottom-0 lg:hidden z-50",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto w-full max-w-screen-sm rounded-t-2xl bg-white shadow-2xl">
          {/* 그립/헤더 */}
          <div className="pt-3 pb-2 flex items-center justify-center">
            <span className="h-1.5 w-12 rounded-full bg-neutral-300" />
          </div>

          {/* 현재 선택 표시(있으면) */}
          {current && (
            <div className="px-4 pb-2 text-xs text-neutral-500">
              현재: {current.slug}
            </div>
          )}

          {/* 목록 */}
          <div className="max-h-[60vh] overflow-y-auto px-2 pb-3">
            {posts.map((post) => (
              <button
                key={post.slug}
                onClick={() => onPick(post.slug)}
                className={clsx(
                  "w-full flex gap-3 items-center px-2 py-2 rounded hover:bg-neutral-100 active:bg-neutral-200",
                  selected === post.slug && "bg-neutral-100"
                )}
              >
                <div className="shrink-0">
                  <Chron {...post} />
                </div>
                <div className="text-left text-sm truncate">{post.slug}</div>
              </button>
            ))}
          </div>

          {/* 닫기 버튼 */}
          <div className="p-3">
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-md border border-neutral-300 py-2 text-sm"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
