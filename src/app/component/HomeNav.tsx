import Link from "next/link";

export default function HomeNav() {
  return (
    <div
      className="fixed top-0 z-[40] left-[50%]
                    flex items-center px-6
                    bg-white/90 backdrop-blur gap-4"
    >
      <a href="note">글</a>
      <Link href="/">홈</Link>
      <a href="work">작업</a>
    </div>
  );
}
