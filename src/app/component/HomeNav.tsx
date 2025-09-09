import Link from "next/link";

export default function HomeNav() {
  return (
    <div className="h-[100px] flex w-full items-center justify-between">
      <a href="note">글</a>
      <Link href="/">홈</Link>
      <a href="work">작업</a>
    </div>
  );
}
