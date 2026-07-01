import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "mail-senders.json"
  );

  const data = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  return Response.json(data);
}