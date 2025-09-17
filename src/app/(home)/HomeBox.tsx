"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Post } from "../lib/type";
import "./home.css";
import Link from "next/link";
import clsx from "clsx";

type HomeProps = {
  posts: Post[];
  recursion?: number;
  maxDepth?: number;
};

const colorCode = [
  "bg-[#7AA4FF]",
  "bg-[#FF7AAF]",
  "bg-[#FFE27A]",
  "bg-[#7A90FF]",
  "bg-[#BAE0FF]",
  "bg-[#FFBABA]",
];

export default function HomeBox({
  posts,
  recursion = 0,
  maxDepth = 4,
}: HomeProps) {
  const [isHover, setHover] = useState(false);
  const [putContent, setPutContent] = useState(recursion < 4 ? false : true);
  const [isRow, setIsRow] = useState(recursion < 1 ? true : false);

  useEffect(() => {
    console.log(isHover);
  }, [isHover]);

  function handleMouseLeave() {
    setHover(false);
  }
  function handleMouseEnter() {
    setHover(true);
  }

  const sizeClasses = [
    "text-xl",
    "text-lg",
    "text-sm",
    "text-[0.8rem]",
    "text-[0.75rem]",
  ];

  useEffect(() => {
    setPutContent(recursion < 4 ? Math.random() < 0.5 : true);
    setIsRow(recursion < 1 ? true : Math.random() < 0.5);
  }, [recursion]);
  function EmptyBox() {
    const repeatNum = Math.floor(Math.random() * 2 + 1);

    return (
      <div
        className={clsx(
          "flex-1 min-w-0 min-h-0 flex items-stretch",
          isRow ? " flex-row" : "flex-col"
        )}
      >
        {Array.from({ length: repeatNum }).map((_, i) => (
          <div key={i} className={clsx(colorCode[recursion], "flex-1")} />
        ))}
      </div>
    );
  }

  if (!Array.isArray(posts) || posts.length === 0) return <EmptyBox />;
  if (recursion >= posts.length) return <EmptyBox />;

  const current = posts[recursion];
  if (!current) return <EmptyBox />;

  return (
    <div
      className={clsx("flex w-full h-full", isRow ? "flex-row" : "flex-col")}
    >
      {/* leaf */}
      <AnimatePresence initial={true}>
        {" "}
        <div className="flex-1 min-w-0 min-h-0 flex items-stretch">
          {putContent ? (
            <motion.div
              key={`child-${recursion}`}
              className="flex-1 min-w-0 min-h-0 flex items-stretch"
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Link
                href={`/${current.parent}?slug=${encodeURIComponent(
                  current.slug
                )}`}
                className={`flex flex-1 items-center justify-center p-2 ${sizeClasses[recursion]}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {current.slug}
              </Link>
            </motion.div>
          ) : (
            <EmptyBox />
          )}
        </div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!isHover && recursion < maxDepth && (
          <motion.div
            key={`child-${recursion}`}
            className="flex-1 min-w-0 min-h-0 flex items-stretch"
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* tree */}
            <HomeBox
              posts={posts}
              recursion={recursion + 1}
              maxDepth={maxDepth}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*
hook은 조건적으로 사용하고, 사용하지 않고 하면 안됨 
무조건 렌더하고 이후 조건 분기 
useMemo랑 useEffect가 뭐가 다른데? 
useMemo: 렌더링 중, 계산이 다시 필요할 때만 계산 , 의존성 배열이 변할 때만 계산 
useEffect: 화면이 그려진 다음, 추가 부수 효과, 
  그냥 값이 바뀌었을 때 이런 거 다시 해줘 하고 값을 저장하지 않음: 윈도우 크기감지 같은 것 
  콜백함수를 전달해줘야함 
  window eventlistener은 해제해줘야 중복으로 쌓이지 않음 
useState: 값이 바뀌면 다시 그림 

 ${sizeClasses[recursion]} 동적으로 계산해서 결정하는 class는 안됨
*/
