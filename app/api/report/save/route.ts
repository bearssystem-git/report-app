import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();

  const { customer, month, data } = body;

  // フォルダ作成
  const dir = path.join(process.cwd(), "data", customer);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // ファイルパス
  const filePath = path.join(dir, `${month}-report.json`);

  // 保存
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ success: true });
}