import { NextResponse } from "next/server";
import { getWorks } from "../../lib/api"; 

export async function GET() {
  const works = getWorks();
  return NextResponse.json(works);
}