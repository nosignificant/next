import { Post } from "../lib/type";
import { useState } from "react";
import Link from "next/link";
import { extractHeadings } from "../lib/slugify";

type PageIndexProps = { posts: Post[]; selected: string };

export default function LittleIndex({ posts, selected }: PageIndexProps) {
  const [isOpen, setOpen] = useState(false);
  const post = posts.find((p) => p.slug === selected);

  if (!post) return;
  const headings = extractHeadings(post.content);

  return (
    <div className="flex items-end justify-end">
      <button
        className="absolute top-[70%] left-[90%] fixed lg:hidden hover:bg-gray-100"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {isOpen && (
          <div>
            {headings.map(({ text, id }) => (
              <Link
                key={id}
                href={`/${post.parent}?slug=${encodeURIComponent(
                  post.slug
                )}#${id}`}
                className="block text-sm hover:bg-gray-100 pb-1"
              >
                {text}
              </Link>
            ))}
          </div>
        )}
        {isOpen ? "-" : "index"}
      </button>
    </div>
  );
}
