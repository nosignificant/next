import { Post } from "../lib/type";
import Heading from "./document/Heading";

type PageIndexProps = { posts: Post[]; selected: string };

export default function SideBar({ posts, selected }: PageIndexProps) {
  const post = posts.find((p) => p.slug === selected);
  if (!post)
    return (
      <div className="flex w-[220px] py-2 bg-white text-neutral-500 justify-center">
        선택된 글이 없어요.
      </div>
    );

  return (
    <div className="w-[220px] shrink-0 sticky top-20  self-start h-fit">
      {posts.map((post) =>
        post.slug === selected ? (
          <div key={post.slug}>
            <Heading className="w-full border-b ">{post.slug}</Heading>
            <div className="text-sm text-neutral-500">
              {post.publishedAt.toString()}
            </div>
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
