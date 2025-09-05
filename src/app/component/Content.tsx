import { Post } from "../lib/type";

type contentProps = { posts: Post[]; selected: string };

export default function SideBar({ posts, selected }: contentProps) {
  return (
    <div className="w-[600px]">
      {" "}
      <div className="">
        {posts.map((post) =>
          post.slug === selected ? (
            <div key={post.slug}>{post.content}</div>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
}
