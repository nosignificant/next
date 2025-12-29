import Link from "next/link";

export default function HomeNav() {
  return (
    <div className="flex gap-6 text-sm font-medium text-neutral-500">
      <Link href="/" className="hover:text-neutral-600 transition">
      운산무소
      </Link>
    </div>
  );
}