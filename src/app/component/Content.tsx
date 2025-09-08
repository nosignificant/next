"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import Link from "next/link";
import Image from "next/image";
import type { Post } from "../lib/type";

import Heading from "./document/Heading";

type ContentProps = { posts: Post[]; selected: string };

export default function Content({ posts, selected }: ContentProps) {
  const post = posts.find((p) => p.slug === selected);
  if (!post) return null;

  const md = typeof post.content === "string" ? post.content : "";

  return (
    <article className="prose prose-neutral w-[400px] md:w-[600px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
        components={{
          h1: (props) => <Heading as="h1" {...props} />,
          h2: (props) => <Heading as="h2" {...props} />,
          h3: (props) => <Heading as="h3" {...props} />,
          h4: (props) => <Heading as="h4" {...props} />,
          h5: (props) => <Heading as="h5" {...props} />,
          h6: (props) => <Heading as="h6" {...props} />,
          p: (props) => <p className="leading-7 my-3" {...props} />,
          a: ({ href = "", children }) => {
            const isExternal = /^https?:\/\//i.test(href);
            return isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-600"
              >
                {children}
              </a>
            ) : (
              <Link href={href} className="underline">
                {children}
              </Link>
            );
          },
          code: ({ inline, children, ...props }) =>
            inline ? (
              <code className="px-1.5 py-0.5 rounded bg-neutral-100">
                {children}
              </code>
            ) : (
              <pre className="p-4 rounded bg-neutral-900 text-neutral-100 overflow-auto">
                <code {...props}>{children}</code>
              </pre>
            ),
          img: ({ src = "", alt = "" }) => (
            <span className="block my-4">
              {/* 정적 호스트가 아니라면 next.config 이미지 도메인 허용 필요 */}
              <Image
                src={src}
                alt={alt}
                width={1280}
                height={720}
                className="rounded"
              />
              {alt && <em className="text-sm text-neutral-500">{alt}</em>}
            </span>
          ),
          ul: (props) => <ul className="list-disc pl-6 my-3" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 my-3" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="border-l-4 pl-4 italic text-neutral-700 my-4"
              {...props}
            />
          ),
          hr: () => <hr className="my-6 border-neutral-200" />,
        }}
      >
        {md}
      </ReactMarkdown>
    </article>
  );
}
