import { NextResponse } from "next/server";
import { getPostData } from "../../lib/parseFile"; // ← fs/gray-matter 쓰는 서버 유틸 (server-only)

export async function GET(req: Request) {
  const splitReq = req.url.split("/");
  const reqSlug = splitReq[splitReq.length - 1];
  console.log("req is: ", reqSlug);
  const list = getPostData(reqSlug);
  return NextResponse.json(list);
}
