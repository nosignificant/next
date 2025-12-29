import type { Post } from "../lib/type";
import Chron from "./Chron";
import clsx from "clsx";

type PostListProps = { 
  posts: Post[]; 
  handleSelected: (slug: string) => void;
  selected?: string; // 현재 선택된 글 하이라이트용
};

export default function PostList({ posts, handleSelected, selected }: PostListProps) {
  return (
    <div className="flex flex-col text-sm font-pretendard pr-4">
      {posts.map((post) => (
        <button
          key={post.slug}
          onClick={() => handleSelected(post.slug)}
          className={clsx(
            "flex items-center gap-3 w-full text-left py-2 px-2 rounded-md transition-colors",
            "hover:bg-neutral-50",
            // 선택된 글이면 배경색 진하게
            selected === post.slug ? "bg-neutral-100 font-medium text-black" : "text-neutral-600"
          )}
        >
          {/* 날짜 표시 */}
          <div className="shrink-0 opacity-70 scale-90 origin-left">
             <Chron {...post} />
          </div>

          {/* 제목 표시 */}
          <div className="truncate w-full">
            {post.slug} 
            {/* slug 대신 post.title이 있다면 post.title을 쓰세요 */}
          </div>
        </button>
      ))}
    </div>
  );
}