import { Post } from "../lib/type";
import Chron from "./Chron";
import clsx from "clsx";
import NoteNav from "./NoteNav";

type SideBarProps = { posts: Post[]; handleSelected: (slug: string) => void };

export default function SideBar({ posts, handleSelected }: SideBarProps) {
  return (
    <div
      className="hidden lg:block w-[300px] text-sm shrink-0 
     font-pretendard text-[0.75rem]"
    >
      {" "}
      <NoteNav />
      {posts.map((post) => (
        <div
          className={clsx(
            "flex gap-2",
            post.chron?.border && post.chron?.notfirst && "border-t"
          )}
          key={post.slug}
          onClick={() => handleSelected(post.slug)}
        >
          <Chron {...post} />

          {/*text nowrap 할까 말까? */}
          {/*text nowrap 할까 말까? */}
          <div className="bg-white py-1 px-1 pb-2 w-full text-nowrap overflow-hidden">
            {post.slug}
          </div>
        </div>
      ))}
    </div>
  );
}
/*
sticky : overflow가 있는 부모의 제일 위에 붙음 
top-0 : 위쪽 여백 없음 
self-start : 
h-fit : 내용물에 높이를 맞춤 
*/
