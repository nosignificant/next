import { Post } from "../lib/type";
import Chron from "./Chron";

type SideBarProps = { posts: Post[]; handleSelected: (slug: string) => void };

export default function SideBar({ posts, handleSelected }: SideBarProps) {
  return (
    <div className="w-[300px]">
      {posts.map((post) => (
        <div
          className="flex flex-row gap-4"
          key={post.slug}
          onClick={() => handleSelected(post.slug)}
        >
          <Chron {...post} />
          <div>{post.slug}</div>
        </div>
      ))}
    </div>
  );
}
