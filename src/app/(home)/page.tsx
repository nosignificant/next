"use client";
import { Post } from "../lib/type";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";

export default function Page({ initialSlug }: { initialSlug: string }) {
  const pathname = usePathname();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  //${encodeURIComponent(selected)}`

  useEffect(() => {
    fetch(`/api`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  const randPosts = useMemo(() => {
    if (posts.length === 0) return [];
    const n = Math.min(4, posts.length);
    const picked = new Set<number>();
    while (picked.size < n) {
      picked.add(Math.floor(Math.random() * posts.length));
    }
    return Array.from(picked).map((i) => posts[i]);
  }, [posts]);
  return (
    <div>
      {randPosts.map((post) => (
        <div key={post.slug}>{post.slug}</div>
      ))}
    </div>
  );
}

/* posts 로딩은 로딩 된 이후 fetch로 되기 때문에 posts들에 데이터가들어오기 전에 
posts 변수를 수정하려고 하면 posts가 비어있기 때문에 빈 배열만 반환함. 
그렇기 때문에 useMemo로 posts 값이 바뀌고 난 뒤에 randPost를 만들어야함 */
