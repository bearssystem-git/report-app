import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(
  req: Request
) {

  const {
    target,
    title,
    body,
    bcc,
    ownCompany,
  } = await req.json();

  // ===== users.json =====
  const usersPath = path.join(
    process.cwd(),
    "data",
    "users.json"
  );

  const users = JSON.parse(
    fs.readFileSync(
      usersPath,
      "utf-8"
    )
  );

  // ===== transporter =====
  const transporter =
  nodemailer.createTransport({

    host:
      "smtp.lolipop.jp",

    port: 465,

    secure: true,

    auth: {

      user:
        process.env
          .MAIL_USER,

      pass:
        process.env
          .MAIL_PASS,

    },

  });

  // ===== 対象 =====
  const targets =
    target === "all"
      ? Object.values(users)
      : [users[target]];

  // ===== 日付 =====
  const now = new Date();

  const year =
    String(
      now.getFullYear()
    );

  const month =
    String(
      now.getMonth()
    );

  // ===== 送信 =====
  for (const user of targets as any[]) {

      if (!user.email) {
        continue;
      }

    // タイトル変換
    const parsedTitle =
      title
        .replace(
          /{%year%}/g,
          year
        )
        .replace(
          /{%month%}/g,
          month
        );

    // 本文変換
    const parsedBody =
      body
        .replace(
          /{%company%}/g,
          user.company ?? ""
        )
        .replace(
          /{%person%}/g,
          user.person ?? ""
        )
        .replace(
          /{%year%}/g,
          year
        )
        .replace(
          /{%month%}/g,
          month
        )
        .replace(
          /{%ownCompany%}/g,
          ownCompany ?? ""
        )
        .replace(
          /{%signature%}/g,
          `
        ――――――――――――――――――――――――――――――<br>
        株式会社BearsSystem<br>
        中田 真由美<br>
        TEL：043-214-7030<br>
        Mail：info@bears-sys.com<br>
        URL：https://bears-sys.com/<br>
        ――――――――――――――――――――――――――――――
        `
        );

    const htmlBody =
      parsedBody.replace(
        /\n\n/g,
        "<br><br>"
      );

    // メール送信
    await transporter.sendMail({

      from:
        process.env.MAIL_USER,

      to:
        user.email,

      bcc:
        bcc || undefined,

      subject:
        parsedTitle,

      html:
        htmlBody,

    });

  }


  console.log(
  target,
  title,
  body,
  ownCompany
);


  return Response.json({
    success: true,
    message:
      "メール送信完了",
  });

}