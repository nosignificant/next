// src/app/work/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Post } from "../lib/type";
import WorkFilter from "../component/work/WorkFilter"; // 분리한 컴포넌트
import WorkGrid from "../component/work/WorkGrid";     // 분리한 컴포넌트

export default function WorkPage() {
  const [works, setWorks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState("All");

  // 데이터 로딩
  useEffect(() => {
    fetch("/api/work")
      .then((res) => res.json())
      .then((data) => setWorks(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 태그 목록 추출
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    works.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, [works]);

  // 필터링된 목록
  const filteredWorks = filterTag === "All"
    ? works
    : works.filter((p) => p.tags.includes(filterTag));

  if (loading) return <div className="p-4 text-neutral-400 text-xs">Loading...</div>;

// src/app/work/page.tsx

return (
  <div className="pb-20 px-1">
    <div className="flex flex-col md:flex-row items-start">
      
      <aside className="w-full md:w-48 shrink-0 md:fixed md:top-24 top-10 z-50">
        <WorkFilter 
          tags={allTags} 
          selectedTag={filterTag} 
          onSelect={setFilterTag} 
        />
      </aside>

      {/* ✅ 메인 영역: aside가 차지하던 w-48만큼 왼쪽 여백(ml-48)을 줌 */}
      <main className="flex-1 w-full md:ml-30">
        <WorkGrid works={filteredWorks} />
      </main>

    </div>
  </div>
);
}