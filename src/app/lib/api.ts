import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "./type";
import { FP, CONTENT_ROOT } from "./paths";

// ==== 유틸 ====

function titleFromSlug(fileName: string): string {
  return fileName.replace(/\.mdx?$/, "");
}

function parseTag(tags: unknown): string[] {
  return Array.isArray(tags) ? (tags as string[]) : [];
}

/**
 * 개별 파일 파싱
 */
function parsePostFile(fileName: string, dirPath: string, category: string): Post {
  const fullPath = path.join(dirPath, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);
  
  const slug = titleFromSlug(fileName);
  const thumbnail = data.thumbnail || `/img/thumbnail/${slug}.png`;

  // 날짜 처리 (YYYY-MM-DD)
  const publishedAt = data.date
    ? new Date(data.date).toISOString().slice(0, 10)
    : "";

  return {
    slug,
    excerpt: data.excerpt || data.description || "",
    content,
    parent: category,
    publishedAt,
    tags: parseTag(data.tags),
    thumbnail,
    chron: null, // 아래 calculateChron에서 계산
  };
}

function calculateChron(posts: Post[]): Post[] {
  // 1. 최신순 정렬
  const sorted = posts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return sorted.map((post, index) => {
    const prevPost = sorted[index - 1];
    
    const [year, month, day] = post.publishedAt.split("-");
    
    let displayYear = year;
    let displayMonth = month;
    let displayDay = day;
    let border = false;

    if (index === 0) {
      border = true;
    } else if (prevPost) {
      const [prevYear, prevMonth, prevDay] = prevPost.publishedAt.split("-");

      if (year === prevYear) {
        displayYear = ""; 
        
        if (month === prevMonth) {
          displayMonth = "";

          if (day === prevDay) {
            displayDay = "";
          }
        }
      } else {
        border = true;
      }
    }

    return {
      ...post,
      chron: {
        year: displayYear,
        month: displayMonth,
        day: displayDay,
        border: border,
        notfirst: !displayYear, 
      },
    };
  });
}

// ==== API 함수들 ====

export function getAllPosts(): Post[] {
  const dirPath = path.join(CONTENT_ROOT, FP.NOTE_PATH);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const posts = files
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => parsePostFile(file, dirPath, "note"));

  return calculateChron(posts);
}

export function getWorks(): Post[] {
  const dirPath = path.join(CONTENT_ROOT, FP.WORK_PATH);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const posts = files
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => parsePostFile(file, dirPath, "work"));

  return calculateChron(posts);
}

export function getPostBySlug(slug: string): Post | null {
  const targets = [
    { path: FP.NOTE_PATH, cat: "note" },
    { path: FP.WORK_PATH, cat: "work" }
  ];

  for (const target of targets) {
    const dirPath = path.join(CONTENT_ROOT, target.path);
    let fileName = `${slug}.mdx`;
    if (!fs.existsSync(path.join(dirPath, fileName))) fileName = `${slug}.md`;

    if (fs.existsSync(path.join(dirPath, fileName))) {
      return parsePostFile(fileName, dirPath, target.cat);
    }
  }
  return null;
}