import type { Post } from "../lib/type";

export default function PostHeader({ post }: { post: Post }) {

  return (
    <div className="mb-10 pt-4 border-b border-neutral-100 pb-8">
      {/* 제목 */}
      <h1 className=" md:text-xl font-bold mb-6 tracking-tight text-black">
        {post.title}
      </h1>
      
      {/* 메타 정보 (날짜 • 태그) */}
      <div className="flex items-center gap-3 text-neutral-400">
        <span className="font-xs">
          {post.publishedAt}
        </span>

        {post.tags.length > 0 && (
          <>
            <span className="opacity-30">•</span>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="font-xs text-neutral-400">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}