import { NextResponse } from "next/server";
import { FP } from "../lib/paths";
import { getPostData } from "../lib/parseFile";

export async function GET() {
  const slugs = Object.values(FP).map((dirPath) => dirPath.split("/").pop()!);
  const all = slugs.flatMap((slug) => getPostData(slug));
  //slug가 배열이어서 all을 이중배열으로 반환해서 오류난거였음 구조를 잘 생각하자

  return NextResponse.json(all);
}
