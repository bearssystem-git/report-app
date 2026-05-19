import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "spam.json");

export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newKeyword = body.keyword;

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (!data.includes(newKeyword)) {
    data.push(newKeyword);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const keyword = body.keyword;

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const newData = data.filter((item: string) => item !== keyword);

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

  return Response.json({ success: true });
}