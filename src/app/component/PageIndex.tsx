import { Post } from "../lib/type";
import Heading from "./document/Heading";
import Link from "next/link";
import { slugify } from "../lib/slugify";

type PageIndexProps = { posts: Post[]; selected: string };

export default function SideBar({ posts, selected }: PageIndexProps) {
  const post = posts.find((p) => p.slug === selected);

  if (!post)
    return (
      <div className="flex w-[220px] py-2 bg-white text-neutral-500 justify-center">
        선택된 글이 없어요.
      </div>
    );

  function extractHeadings(md: string) {
    const lines = md.split("\n").filter((l) => /^#{1,6}\s+/.test(l));
    const counts = new Map<string, number>();

    return lines.map((raw) => {
      const text = raw.replace(/^#{1,6}\s*/, "").trim();
      const base = slugify(text);
      const n = counts.get(base) ?? 0;
      counts.set(base, n + 1);
      const id = n === 0 ? base : `${base}-${n}`;
      return { text, id };
    });
  }

  const headings = extractHeadings(post.content);

  return (
    <div className="lg:w-[220px] shrink-0 self-start h-fit px-4 lg:px-0">
      <div className="h-4 "></div>
      {posts.map((post) =>
        post.slug === selected ? (
          <div key={post.slug}>
            <div className="w-full pb-4">
              <Heading>{post.slug}</Heading>
              <div className="text-[0.75rem] text-neutral-500 pt-1">
                {post.publishedAt.toString()}
              </div>
            </div>

            {headings.map(({ text, id }) => (
              <div key={id} className="hover:bg-gray-100 pb-1">
                <Link
                  href={`/${post.parent}?slug=${encodeURIComponent(
                    post.slug
                  )}#${id}`}
                  className="text-sm "
                >
                  {text}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
}

/* 
filter에서 빈 배열 반환이 됐는데, inline함수 쓸 떄 
내부에서 반환을 해야함. 근데 {}이렇게 쓰면 리턴이 없음. 
{}를 쓰고 return을 쓰거나 ()이렇게써서 바로 return시켜야됨 
*/
