// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { getAllPosts } from  "../../lib/api";

export async function GET() {
  const posts = getAllPosts(); // note 폴더의 모든 글 가져옴
  return NextResponse.json(posts);
}