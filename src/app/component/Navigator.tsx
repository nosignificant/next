export default function Navigator() {
  return (
    <header className="w-100">
      <div className={`h-4 w-auto flex gap-4 text-sm items-center text-nowrap`}>
        <a href="note">기록 </a>
        <a href="read">독서</a>
        <a href="study">공부</a>
      </div>
    </header>
  );
}
