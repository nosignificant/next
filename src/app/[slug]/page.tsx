"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SideBar from "../component/SideBar";
import PageIndex from "../component/PageIndex";
import Content from "../component/Content";
import type { Post } from "../lib/type";

export default function StudyPage() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // 예: "/note", "/study"
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

  if (loading) return <p>불러오는 중…</p>;

  return (
    <div className="flex flex-col justify-center lg:flex-row gap-8 py-2 lg:justify-start">
      <div className="flex sticky top-0 self-start h-fit">
        <SideBar posts={posts} handleSelected={handleSelected} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <PageIndex posts={posts} selected={selected} />
        <Content posts={posts} selected={selected} />
      </div>
    </div>
  );
}
