import { Post } from "../lib/type";

type PageIndexProps = { posts: Post[]; selected: string };

export default function SideBar({ posts, selected }: PageIndexProps) {
  return (
    <div className="w-[200px]">
      {posts.map((post) =>
        post.slug === selected ? (
          <div key={post.slug}>
            <div>{post.slug}</div>
            <div>{post.publishedAt.toString()}</div>
            <h1>제목1</h1>
            <h2>제목2</h2>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
}
