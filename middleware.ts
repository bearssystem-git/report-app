import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ここに必要なら処理を書く

  return res; // ← 必ず関数の中
}