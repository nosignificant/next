// 예: app/notes/NotesClient.tsx
"use client";
import { Post } from "../lib/type";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SideBar from "../component/SideBar";
import PageIndex from "../component/PageIndex";
import Content from "../component/Content";

export default function Page({ initialSlug }: { initialSlug: string }) {
  const pathname = usePathname();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  function handleSelected(slug: string) {
    setSelected(slug);
  }
  //${encodeURIComponent(selected)}`

  useEffect(() => {
    fetch(`/api/${pathname}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>불러오는 중…</p>;
  return (
    <div className="flex gap-4">
      <SideBar posts={posts} handleSelected={handleSelected} />;
      <PageIndex posts={posts} selected={selected} />;
      <Content posts={posts} selected={selected} />;
    </div>
  );
}
