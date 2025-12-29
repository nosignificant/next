import Link from "next/link";

export default function HomeNav() {
  return (
    <div className="font-bold text-xl tracking-tight">
      <Link href="/" className="hover:text-neutral-600 transition">
      </Link>
    </div>
  );
}