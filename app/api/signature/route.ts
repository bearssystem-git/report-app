import fs from "fs";

import path from "path";


// ====================
// GET
// ====================
export async function GET() {

  const filePath = path.join(
    process.cwd(),
    "data",
    "signature.json"
  );

  const json = JSON.parse(

    fs.readFileSync(
      filePath,
      "utf-8"
    )

  );

  return Response.json(
    json
  );

}


// ====================
// POST
// ====================
export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const filePath = path.join(
    process.cwd(),
    "data",
    "signature.json"
  );

  fs.writeFileSync(

    filePath,

    JSON.stringify(
      body,
      null,
      2
    )

  );

  return Response.json({
    success: true,
  });

}