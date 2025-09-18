export function slugify(s: string) {
  const a = s.toLowerCase().trim();
  console.log(a);
  return a;
}

export function extractHeadings(md: string) {
  const lines = md.split("\n").filter((l) => /^#{1,6}\s+/.test(l));
  const counts = new Map<string, number>();

  return lines.map((raw) => {
    const text = raw.replace(/^#{1,6}\s*/, "").trim();
    const base = slugify(text);
    const n = counts.get(base) ?? 0;
    counts.set(base, n + 1);
    const id = n === 0 ? base : `${base}-${n}`;
    return { text, id };
  });
}
