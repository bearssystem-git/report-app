import fs from "fs";
import path from "path";

export async function GET() {

  const logPath = path.join(
    process.cwd(),
    "data",
    "update-log.json"
  );

  const data = JSON.parse(
    fs.readFileSync(logPath, "utf8")
  );

  return Response.json(data);
}