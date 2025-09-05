import Link from "next/link";

export default function HomeNav() {
  return (
    <header className="w-100">
      <div className={`h-4 w-auto flex gap-4 text-sm items-center text-nowrap`}>
        <Link href="/">홈</Link>
        <a href="work">작업</a>
        <a href="note">글</a>
      </div>
    </header>
  );
}
