import Link from "next/link";
import { extractHeadings } from "../lib/slugify"; // 경로 확인
import type { Post } from "../lib/type";

type TOCProps = { posts: Post[]; selected: string };

export default function TableOfContents({ posts, selected }: TOCProps) {
  const post = posts.find((p) => p.slug === selected);

  if (!post) return null;

  const headings = extractHeadings(post.content);


  if (!headings || headings.length === 0) return null;

  return (
    <div className="pl-4 border-l border-neutral-100 text-sm">

      <div className="flex flex-col gap-2">
        {headings.map(({ text, id }) => (
          <Link
            key={id}
            href={`#${id}`} 
            onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block text-neutral-500 hover:text-black transition-colors"
          >
            {text}
          </Link>
        ))}
      </div>
    </div>
  );
}