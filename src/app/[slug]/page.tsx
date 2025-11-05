"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SideBar from "../component/SideBar";
import PageIndex from "../component/PageIndex";
import Content from "../component/Content";
import type { Post } from "../lib/type";
import LittleIndex from "../component/LittleIndex";
import BottomBar from "../component/BottomBar";

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

  if (loading) return <p>불러오는 중…</p>;

  return (
    <div className="flex flex-col justify-center lg:flex-row  lg:justify-start py-2">
      <div className="flex flex-col lg:flex-row lg:sticky top-0 self-start h-fit gap-8">
        <SideBar posts={posts} handleSelected={handleSelected} />
        <PageIndex posts={posts} selected={selected} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {" "}
        <Content posts={posts} selected={selected} />
      </div>

      <div className="flex flex-col"></div>
      <LittleIndex posts={posts} selected={selected} />
      <BottomBar
        posts={posts}
        handleSelected={handleSelected}
        selected={selected}
      />
    </div>
  );
}
