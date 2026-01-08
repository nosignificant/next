"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Link from "next/link"; 

import type { ComponentPropsWithoutRef, JSX } from "react";
import type { ExtraProps } from "react-markdown";
import type { Post } from "../lib/type";

import Heading from "./document/Heading";
import BlockCode from "./document/BlockCode";



type MarkdownComponentProps<T extends keyof JSX.IntrinsicElements & string> = 
  ComponentPropsWithoutRef<T> & ExtraProps;

function Paragraph({ className, children, ...props }: MarkdownComponentProps<"p">) {
  return (
    <div 
      className={`text-neutral-800 mt-1 ${className || ""}`} 
      {...props} 
    >
      {children}
    </div>
  );
}

const components = {
  h1: ({ ...props }: MarkdownComponentProps<"h1">) => (
    <Heading as="h1" {...props} />
  ),
  h2: ({ ...props }: MarkdownComponentProps<"h2">) => (
    <Heading as="h2" {...props} />
  ),
  h3: ({ ...props }: MarkdownComponentProps<"h3">) => (
    <Heading as="h3" {...props} />
  ),

  blockquote: ({ ...props }: MarkdownComponentProps<"blockquote">) => (
    <blockquote 
      className="border-l-4 border-neutral-300 p-4 my-4 py-[0.4rem] pb-[0.7rem] bg-neutral-50 text-neutral-600" 
      {...props} 
    />
  ),
  ul: ({ ...props }: MarkdownComponentProps<"ul">) => (
    <ul 
      className="list-disc list-outside ml-5 text-neutral-800"
      {...props} 
    />
  ),
  ol: ({ ...props }: MarkdownComponentProps<"ol">) => (
    <ol className="list-decimal list-outside ml-5 text-neutral-800" {...props} />
  ),
  li: ({ ...props }: MarkdownComponentProps<"li">) => (
    <li className="pl-1" {...props} />
  ),

  a: ({ href, children, ...props }: MarkdownComponentProps<"a">) => {
    const linkHref = href || "";
    const isInternal = linkHref.startsWith("/") || linkHref.startsWith("#");
    
    const linkClasses = "text-blue-700 cursor-pointer transition-colors";

    if (isInternal) {
      return (
        <Link href={linkHref} className={linkClasses} {...props}>
          {children}
        </Link>
      );
    }

    // 외부 링크는 새 탭으로 열기
    return (
      <a 
        href={linkHref} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={linkClasses} 
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: BlockCode,
  
  p: Paragraph,

  code: ({ inline, className, children, ...props }: MarkdownComponentProps<"code"> & { inline?: boolean }) => {
    if (!inline) {
      return <code className={className} {...props}>{children}</code>;
    }
    return (
      <code
        className="bg-neutral-100 text-neutral-800 rounded px-1.5 py-0.5 font-mono align-middle"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export default function Content({ posts, selected }: { posts: Post[]; selected: string; }) {
  const post = posts.find((p) => p.slug === selected);
  if (!post) return null;

  return (
    <article className="
      prose prose-neutral max-w-none 
      text-[14px] 
      leading-[26.5px] 
    ">
      <ReactMarkdown 
        rehypePlugins={[rehypeSlug, rehypeRaw]}        
        remarkPlugins={[remarkGfm]} 
        components={components} 
      >
        {post.content}
      </ReactMarkdown>
    </article>
  );
}