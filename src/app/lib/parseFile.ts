import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "./type";
import { FP } from "./paths";

// ==== 유틸 함수 ====

function parseTag(arr: unknown): string[] {
  return Array.isArray(arr) ? (arr as string[]) : [];
}

// ==== 파서 ====

export function getPostData(reqSlug: string): Post[] {
  let base_path = "";
  if (reqSlug === "note") base_path = FP.NOTE_PATH;
  else if (reqSlug === "work") base_path = FP.WORK_PATH;
  
  // 경로가 없거나 폴더가 없으면 빈 배열 반환
  if (!base_path) return [];
  const POSTS_PATH = path.join(process.cwd(), base_path);
  if (!fs.existsSync(POSTS_PATH)) return [];

  const entries = fs.readdirSync(POSTS_PATH, { withFileTypes: true });
  
  // .md 또는 .mdx 파일만 필터링
  const posts = entries
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
    .map((entry) => entry.name);

  const allPostsData = posts.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, "");
    
    const fullPath = path.join(POSTS_PATH, fileName);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(raw);

    const title = matterResult.data.title || slug;

    const thumbnail = matterResult.data.thumbnail || `/img/thumbnail/${slug}.png`;
    
    const dateValue = matterResult.data.date;
    const publishedAt = dateValue
      ? new Date(dateValue).toISOString().slice(0, 10)
      : "";

    const tags = parseTag(matterResult.data.tags);

    return {
      title,       
      slug,        
      excerpt: matterResult.data.excerpt || "",
      parent: reqSlug,
      publishedAt,
      thumbnail,
      content: matterResult.content,
      author: null,
      tags: tags,
    };
  });

  return allPostsData.sort((a, b) => 
    (a.publishedAt > b.publishedAt ? -1 : 1)
  );
}