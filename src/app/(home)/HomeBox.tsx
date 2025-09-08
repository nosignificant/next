"use client";

import { useEffect, useState } from "react";
import type { Post } from "../lib/type";
import "./home.css";
import Link from "next/link";

type HomeProps = {
  posts: Post[];
  recursion?: number;
  maxDepth?: number;
};

type Box = {
  recursion: number;
  isCol: boolean;
  putContent: boolean;
  posts: Post[];
};

export default function HomeBox({
  posts,
  recursion = 0,
  maxDepth = 1,
}: HomeProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const current = posts[recursion];
  const putContent = recursion < 4 ? Math.random() < 0.5 : true;
  const isRow = recursion < 2 ? true : Math.floor(Math.random() * 2);

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function EmptyBox() {
    const repeatNum = Math.floor(Math.random() * 5);

    return (
      <div className={isRow ? "flex flex-row" : "flex flex-col"}>
        {Array.from({ length: repeatNum }).map((_, i) => (
          <div key={i} className="border-b border-l" />
        ))}
      </div>
    );
  }

  return (
    <div className="split ">
      <div className={isRow ? " flex flex-row" : "flex flex-col"}>
        {putContent ? (
          <Link
            className="tile"
            href={`/${current.parent}?slug=${encodeURIComponent(current.slug)}`}
          >
            <div className="items-center justify-center"> {current.slug}</div>
          </Link>
        ) : (
          <EmptyBox />
        )}
        <HomeBox posts={posts} recursion={recursion + 1} maxDepth={maxDepth} />
      </div>
    </div>
  );
}

/*
useMemo랑 useEffect가 뭐가 다른데? 
useMemo: 렌더링 중, 계산이 다시 필요할 때만 계산 , 의존성 배열이 변할 때만 계산 
useEffect: 화면이 그려진 다음, 추가 부수 효과, 
  그냥 값이 바뀌었을 때 이런 거 다시 해줘 하고 값을 저장하지 않음: 윈도우 크기감지 같은 것 
  콜백함수를 전달해줘야함 
  window eventlistener은 해제해줘야 중복으로 쌓이지 않음 
useState: 값이 바뀌면 다시 그림 
*/
