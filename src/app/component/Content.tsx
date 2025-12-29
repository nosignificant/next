"use client";

import ReactMarkdown from "react-markdown";

import Image from "next/image";
import type { Post } from "../lib/type";

import Heading from "./document/Heading";
import Paragraph from "./document/Paragraph";
import InLineLink from "./document/InlineLink";

type ContentProps = { posts: Post[]; selected: string };

export default function Content({ posts, selected }: ContentProps) {
  const post = posts.find((p) => p.slug === selected);
  if (!post) return null;

  const md = typeof post.content === "string" ? post.content : "";
  return (
    <article className="prose prose-neutral px-4 md:pr-0">
      <ReactMarkdown
        components={{
          h1: (props) => <Heading as="h1" {...props} />,
          h2: (props) => <Heading as="h2" {...props} />,
          h3: (props) => <Heading as="h3" {...props} />,
          h4: (props) => <Heading as="h4" {...props} />,
          h5: (props) => <Heading as="h5" {...props} />,
          h6: (props) => <Heading as="h6" {...props} />,
          p: (props) => <Paragraph {...props} />,
          a: ({ href = "", children }) => (
            <InLineLink href={href}>{children}</InLineLink>
          ),
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
          ul: (props) => (
            <ul
              className="list-disc text-[0.85rem] leading-[24.5px]"
              {...props}
            />
          ),
          ol: (props) => (
            <ol
              className="list-decimal text-[0.85rem] leading-[24.5px]"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-gray pl-4 text-neutral-700 my-4"
              {...props}
            />
          ),
          hr: () => <hr className="my-6 border-neutral-200" />,
        }}
      >
        {md}
      </ReactMarkdown>
      <div className="py-[50px]"></div>
    </article>
  );
}
