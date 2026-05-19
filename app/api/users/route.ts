import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersPath = path.join(process.cwd(), "data", "users.json");

// GET
export async function GET() {
  if (!fs.existsSync(usersPath)) {
    return NextResponse.json({});
  }

  const data = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  return NextResponse.json(data);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  // 🔥 users.json 保存
  fs.writeFileSync(usersPath, JSON.stringify(body, null, 2));

  // 🔥 顧客フォルダ作成
  for (const key in body) {
    const customer = body[key].customer;

    const dir = path.join(process.cwd(), "data", customer);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log("フォルダ作成:", dir);
    }
  }

  return NextResponse.json({ ok: true });
}