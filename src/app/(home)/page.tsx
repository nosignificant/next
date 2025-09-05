"use client";
import { Post } from "../lib/type";
import { useEffect, useState } from "react";
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

  return (
    <div>
      {posts.map((post) => (
        <div key={`${post.parent}-${post.slug}-${post.publishedAt}`}>
          {post.slug}
        </div>
      ))}
    </div>
  );
}
