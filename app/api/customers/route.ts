import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "customers.json");
const dataDir = path.join(process.cwd(), "data");

// 取得
export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Response.json(data);
}

// 追加
export async function POST(req: Request) {
  const body = await req.json();
  const { email, customer } = body;

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  data[email] = customer;

  // 🔥 フォルダ作成
  const customerDir = path.join(dataDir, customer);
  if (!fs.existsSync(customerDir)) {
    fs.mkdirSync(customerDir);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json({ success: true });
}

// 削除
export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const customer = data[email];

  delete data[email];

  // 🔥 フォルダ削除
  const customerDir = path.join(dataDir, customer);
  if (fs.existsSync(customerDir)) {
    fs.rmSync(customerDir, { recursive: true, force: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json({ success: true });
}