import fs from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "data",
  "mail-template.json"
);

// ===== 初期値 =====
const defaultData = {

  selectedTemplate:
    "template1",

  templates: {

    template1: {

      title:
        "",

      body:
        "",

    },

    template2: {

      title:
        "",

      body:
        "",

    },

  },

};

// ===== GET =====
export async function GET() {

  // ファイル無い場合
  if (
    !fs.existsSync(
      filePath
    )
  ) {

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        defaultData,
        null,
        2
      )
    );

  }

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

// ===== POST =====
export async function POST(
  req: Request
) {

  const body =
    await req.json();

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