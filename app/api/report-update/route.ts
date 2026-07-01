import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST() {

  return new Promise((resolve) => {

    exec(
      "node scripts/fetch-ga.js",
      (error, stdout) => {

        if (error) {
          resolve(
            Response.json({
              success: false,
            })
          );
          return;
        }

        const logPath = path.join(
          process.cwd(),
          "data",
          "update-log.json"
        );

        fs.writeFileSync(
          logPath,
          JSON.stringify(
            {
              lastUpdate:
                new Date().toLocaleString("ja-JP"),
            },
            null,
            2
          )
        );

        resolve(
          Response.json({
            success: true,
          })
        );

      }
    );

  });

}