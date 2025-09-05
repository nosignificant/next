// src/lib/notes.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "./type";
import chronDate from "./chronDate";
// ==== 설정 ====

const NOTE_PATH = "src/app/content/note";
const STUDY_PATH = "src/app/content/study";
const READ_PATH = "src/app/content/read";

// ==== 유틸 함수 ====

function titleFromSlug(slug: string): string {
  const parts = slug.split("/").filter(Boolean);
  return parts[parts.length - 1] || slug;
}

function parseTag(arr: string[]): string[] {
  return Array.isArray(arr) ? arr : [];
}

// ==== 파서 ====

export function getPostData(reqSlug: string): Post[] {
  let base_path = "";
  if (reqSlug === "note") base_path = NOTE_PATH;
  else if (reqSlug === "study") base_path = STUDY_PATH;
  else if (reqSlug === "read") base_path = READ_PATH;
  const POSTS_PATH = path.join(process.cwd(), base_path);

  const entries = fs.readdirSync(POSTS_PATH, { withFileTypes: true });
  const posts = entries
    .map((e) => e.name)
    .filter((name) => /\.(md|mdx)$/i.test(name));

  const allPostsData = posts.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const slug = titleFromSlug(id);
    const fullPath = path.join(POSTS_PATH, fileName);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(raw);
    console.log(matterResult.data.date);
    const publishedAt = matterResult.data.date
      .toLocaleString("ko-KR")
      .slice(0, 11);
    const tags = parseTag(matterResult.data.tags);
    return {
      slug,
      excerpt: matterResult.data.excerpt,
      publishedAt,
      content: matterResult.content,
      author: null,
      tags: tags,
      chron: null,
    };
  });
  return chronDate(allPostsData);
}
