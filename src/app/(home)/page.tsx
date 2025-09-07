"use client";
import { Post } from "../lib/type";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./home.css";
import HomeBox from "./HomeBox";

export default function Page({ initialSlug }: { initialSlug: string }) {
  const pathname = usePathname();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  //${encodeURIComponent(selected)}`

  useEffect(() => {
    fetch(`/api`)
      .then((res) => res.json())
      .then((data) => setPosts(shuffle(data)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("posts length:", posts.length);
  }, [posts]);

  function shuffle(arr: Post[]): Post[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return (
    <div className="mosaic">
      {[0, 4, 8, 12, 16, 20, 24, 28].map((start) => (
        <HomeBox
          key={start}
          posts={posts.slice(start, start + 4)}
          recursion={0}
        />
      ))}
    </div>
  );
}

/* posts 로딩은 로딩 된 이후 fetch로 되기 때문에 posts들에 데이터가들어오기 전에 
posts 변수를 수정하려고 하면 posts가 비어있기 때문에 빈 배열만 반환함. 
그렇기 때문에 useMemo로 posts 값이 바뀌고 난 뒤에 randPost를 만들어야함 */

/* 
window.innerHeight 같은 건 useEffect로 변화가 일어난 다음에 쓰기 
window.addEventListner은 페이지가 다른 곳으로 넘어가도 있기 떄문에 useEffect에서 언마운트 
재귀 쓰고 싶으면 함수 받는 쪽에서 초기값 0 으로 설정할 수 있음 
*/
