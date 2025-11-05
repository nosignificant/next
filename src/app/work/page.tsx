"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { forGraphData } from "../lib/parseWork";
import type { Post } from "../lib/type";

import React from "react";
import Content from "../component/Content";
import WorkGraph from "../component/graph/WorkGraph";
import HomeNav from "../component/HomeNav";
import Heading from "../component/document/Heading";

export default function StudyPage() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialSlug = search.get("slug") ?? "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(initialSlug);

  useEffect(() => {
    fetch(`/api${pathname}`)
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [pathname]);

  useEffect(() => {
    setSelected(initialSlug);
  }, [initialSlug]);

  const handleSelected = (slug: string) => {
    setSelected(slug);
    router.replace(`${pathname}?slug=${encodeURIComponent(slug)}`, {
      scroll: false,
    });
  };

  const sortedNode = forGraphData(posts);

  if (loading) return <p className="p-6">불러오는 중…</p>;

  return (
    <div className="relative min-h-screen">
      <HomeNav />

      {/* 그래프: 내비 아래부터 꽉 채우기 */}
      <div className="fixed left-0 right-0 bottom-0 z-0">
        <WorkGraph sortedNode={sortedNode} handleSelected={handleSelected} />
      </div>

      {/* 사이드 패널 + 백드롭 */}
      <AnimatePresence>
        {!!selected && (
          <>
            {/* 백드롭: 내비 아래 영역만 덮기 (nav는 클릭 가능) */}
            <motion.button
              aria-label="close panel backdrop"
              className="fixed left-0 right-0 top-0 bottom-0 z-[20] bg-black/30 backdrop-blur-[1px]"
              onClick={() => {
                setSelected("");
                router.replace(pathname, { scroll: false });
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* 패널 */}
            <motion.aside
              className="
                fixed right-0 top-0 bottom-0 z-[25]   /* ⬅️ top/bottom으로 높이 고정 */
                w-full sm:w-[420px] md:w-[480px] lg:w-[520px]
                bg-white shadow-2xl border-l border-neutral-200
                flex flex-col
                max-h-screen                             /* ⬅️ iOS 대비 */
              "
              role="dialog"
              aria-modal="true"
              aria-label="Post detail"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
            >
              {/* 헤더: 수축 금지 */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 shrink-0">
                <div className="flex items-center gap-3 px-4 py-1">
                  <div className="min-w-0 flex-1">
                    <Heading className="truncate">{selected}</Heading>
                  </div>
                </div>
              </div>

              {/* 본문 스크롤 영역 */}
              <div
                className="
                  flex-1 min-h-0 overflow-y-auto px-4 py-4  /* ⬅️ min-h-0 필수 */
                  overscroll-contain                         /* ⬅️ iOS 바운스 방지(선택) */
                "
              >
                <Content selected={selected} posts={posts} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
