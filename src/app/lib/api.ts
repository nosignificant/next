import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "./type";
import { FP, CONTENT_ROOT } from "./paths";

// ==== 유틸 ====

function parseTag(tags: unknown): string[] {
  return Array.isArray(tags) ? (tags as string[]) : [];
}


function parsePostFile(fileName: string, dirPath: string, category: string): Post {
  const fullPath = path.join(dirPath, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  const slug = fileName.replace(/\.mdx?$/, "");

  const title = data.title || slug;

  const thumbnail = data.thumbnail || `/img/thumbnail/${slug}.png`;

  const publishedAt = data.date
    ? new Date(data.date).toISOString().slice(0, 10)
    : "";

  return {
    title,       
    slug,        
    excerpt: data.excerpt || data.description || "",
    content,
    parent: category,
    publishedAt,
    tags: parseTag(data.tags),
    thumbnail,
  };
}


// ==== API 함수들 ====

export function getAllPosts(): Post[] {
  const dirPath = path.join(CONTENT_ROOT, FP.NOTE_PATH);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const posts = files
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => parsePostFile(file, dirPath, "note"));
  
  return posts.sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
}

export function getWorks(): Post[] {
  const dirPath = path.join(CONTENT_ROOT, FP.WORK_PATH);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const posts = files
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => parsePostFile(file, dirPath, "work"));

  return posts.sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  const targets = [
    { path: FP.NOTE_PATH, cat: "note" },
    { path: FP.WORK_PATH, cat: "work" }
  ];

  for (const target of targets) {
    const dirPath = path.join(CONTENT_ROOT, target.path);
    
    // 요청받은 slug(파일명)로 실제 파일 찾기
    let fileName = `${slug}.mdx`;
    if (!fs.existsSync(path.join(dirPath, fileName))) fileName = `${slug}.md`;

    if (fs.existsSync(path.join(dirPath, fileName))) {
      return parsePostFile(fileName, dirPath, target.cat);
    }
  }
  return null;
}