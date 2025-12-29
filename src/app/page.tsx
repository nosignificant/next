import { redirect } from "next/navigation";
import { getAllPosts } from "./lib/api";

export default async function HomePage() {
  const posts = getAllPosts();

  if (posts.length > 0) {
    // 🚨 수정된 부분: 한글/한자 깨짐 방지를 위해 인코딩 필수!
    const encodedSlug = encodeURIComponent(posts[0].slug);
    redirect(`/${encodedSlug}`);
  }

  return (
    <div className="flex items-center justify-center h-[50vh] text-neutral-400">
      작성된 글이 없습니다.
    </div>
  );
}