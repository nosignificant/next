import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "./type";
import { FP } from "./paths";
import chronDate from "./chronDate";

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
  if (reqSlug === "note") base_path = FP.NOTE_PATH;
  else if (reqSlug === "work") base_path = FP.WORK_PATH;
  if (!base_path) return [];

  const POSTS_PATH = path.join(process.cwd(), base_path);
  //console.log("postPath: ", POSTS_PATH);

  const entries = fs.readdirSync(POSTS_PATH, { withFileTypes: true });
  const posts = entries
    .map((e) => e.name)
    .filter((name) => /\.(md|mdx)$/i.test(name));

  const allPostsData = posts.map((fileName) => {
    //console.log("fileName", fileName);
    const id = fileName.replace(/\.md$/, "");
    const slug = titleFromSlug(id);
    const fullPath = path.join(POSTS_PATH, fileName);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(raw);
    const thumbnail = `/img/thumbnail/${slug}.png`;
    const publishedAt = matterResult.data.date
      .toLocaleString("ko-KR")
      .slice(0, 11);
    const tags = parseTag(matterResult.data.tags);
    return {
      slug,
      excerpt: matterResult.data.excerpt,
      parent: reqSlug,
      publishedAt,
      thumbnail: thumbnail,
      content: matterResult.content,
      author: null,
      tags: tags,
      chron: null,
    };
  });
  return chronDate(allPostsData);
}
