"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Post } from "../lib/type";

import PostList from "../component/PostList";
import Content from "../component/Content";
import PostHeader from "../component/PostHeader";
import TableOfContents from "../component/TableOfContents";
import BottomBar from "../component/BottomBar";
import TagFilter from "../component/TagFilter";

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {

  const router = useRouter();
  const searchParams = useSearchParams(); 

  const { slug } = use(params);
  const currentSlug = decodeURIComponent(slug);

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(currentSlug);

  const filterTag = searchParams.get("tag") || "";

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then((res) => res.json()),
      fetch("/api/work").then((res) => res.json())
    ])
    .then(([notes, works]) => {
      const combined = [...(Array.isArray(notes) ? notes : []), ...(Array.isArray(works) ? works : [])];
      setAllPosts(combined);
    })
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelected(currentSlug);
  }, [currentSlug]);

  const setFilterTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    router.replace(`/${selected}?${params.toString()}`, { scroll: false });
  };

  const handleSelected = (newSlug: string) => {
    setSelected(newSlug);
    const tagParam = filterTag ? `?tag=${filterTag}` : "";
    router.push(`/${newSlug}${tagParam}`);
  };

  const currentPost = allPosts.find((p) => p.slug === selected);
  const isWork = currentPost?.parent === "work";
  
  const sidebarPosts = useMemo(() => {
    return allPosts.filter((p) => p.parent === (isWork ? "work" : "note"));
  }, [allPosts, isWork]);

  const sidebarTags = useMemo(() => {
    const tags = new Set<string>();
    sidebarPosts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [sidebarPosts]);

  const filteredSidebarPosts = filterTag
    ? sidebarPosts.filter((p) => p.tags.includes(filterTag))
    : sidebarPosts;

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="relative w-full h-full">
      
      {/* Grid 레이아웃 */}
      <div className="hidden md:grid min-h-screen items-start gap-6 xl:gap-12
        md:grid-cols-[280px_1fr_40px]
        lg:grid-cols-[320px_1fr_300px]
        xl:grid-cols-[380px_1fr_320px]"
      >
        
        {/* [왼쪽] 사이드바 */}
        <aside className="sticky top-24 h-[calc(100vh-100px)] flex flex-col border-r border-neutral-100 pr-4">
          <div className="shrink-0 max-h-[40%] overflow-y-auto scrollbar-hide pb-4 border-b border-neutral-50 mb-4">
             <TagFilter 
               tags={sidebarTags} 
               selectedTag={filterTag} 
               onSelect={setFilterTag} 
             />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <PostList 
              posts={filteredSidebarPosts} 
              handleSelected={handleSelected} 
              selected={selected} 
            />
          </div>
        </aside>

        {/* [중앙] 본문 - 여기가 문제였습니다! */}
        {/* ✅ 수정됨: 
            1. max-w-4xl : 본문 너비 제한 (너무 커지는 것 방지)
            2. min-w-0   : Flex/Grid 자식이 넘칠 때 줄어들게 허용 (가로 스크롤 방지 필수)
        */}
        <section className="pb-20 px-4 max-w-4xl min-w-0 w-full">
          {currentPost ? (
            <>
              <PostHeader post={currentPost} />
              <Content posts={allPosts} selected={selected} />
            </>
          ) : (
             <div className="text-neutral-500 text-sm leading-relaxed mt-4">
               雲散霧消는 Rain World라는 비디오 게임을 플레이 한 후 게임의 가능성에 빠졌다.<br/>
               불교, 기계, 생물, 자연의 조화를 탐구한다.
             </div>
          )}
        </section>

        {/* [오른쪽] 목차 */}
        <aside className="hidden lg:block sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pt-10 pl-4">
          <TableOfContents posts={allPosts} selected={selected} />
        </aside>
      </div>

      {/* --- 모바일 레이아웃 --- */}
      <div className="md:hidden flex flex-col pb-20 px-4">
         {currentPost ? (
          <>
            <PostHeader post={currentPost} />
            <Content posts={allPosts} selected={selected} />
          </>
        ) : (
           <div className="text-neutral-500 text-sm leading-relaxed mt-4">
               雲散霧消는 Rain World라는 비디오 게임을 플레이 한 후 게임의 가능성에 빠졌다.<br/>
               불교, 기계, 생물, 자연의 조화를 탐구한다.
           </div>
        )}
        
        <BottomBar
          posts={sidebarPosts}
          handleSelected={handleSelected}
          selected={selected}
          tags={sidebarTags}
          selectedTag={filterTag}
          onSelect={setFilterTag}
        />
      </div>
    </div>
  );
}