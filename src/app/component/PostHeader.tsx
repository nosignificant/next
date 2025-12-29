import type { Post } from "../lib/type";

export default function PostHeader({ post }: { post: Post }) {
  // 날짜 형식 변환 (2025-09-26 -> 20250926)
  const dateStr = post.publishedAt.replace(/-/g, "");

  return (
    <div className="mb-10 pt-4 border-b border-neutral-100 pb-8">
      {/* 제목 */}
      <h1 className=" md:text-xl font-bold mb-6 tracking-tight text-black">
        {post.slug}
      </h1>
      
      {/* 메타 정보 (날짜 • 태그) */}
      <div className="flex items-center gap-3 text-neutral-400">
        <span className="font-xs">
          {dateStr}
        </span>

        {post.tags.length > 0 && (
          <>
            <span className="opacity-30">•</span>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="font-xs text-neutral-400">
                  {/* ✅ 수정됨: 여기에 있던 '#' 문자를 삭제했습니다. */}
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