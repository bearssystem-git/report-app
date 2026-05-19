const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function generateAll() {
  const dataDir = path.join(__dirname, "..", "data");
  const templatePath = path.join(__dirname, "..", "templates", "report.html");

  const customers = fs.readdirSync(dataDir);

  const browser = await puppeteer.launch();

  for (const customer of customers) {
    const customerDir = path.join(dataDir, customer);
    const files = fs.readdirSync(customerDir);

    const jsonFiles = files.filter(f => f.endsWith(".json"));

    for (const file of jsonFiles) {
      const month = file.replace(".json", "");

      const dataPath = path.join(customerDir, file);
      const outputDir = path.join(__dirname, "..", "public", "pdfs", customer);
      const outputPath = path.join(outputDir, `${month}.pdf`);

      // フォルダなければ作る
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const json = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      let html = fs.readFileSync(templatePath, "utf-8");

      const rows = json.referrers.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${r.name}</td>
          <td>${r.users}</td>
        </tr>
      `).join("");

      html = html
        .replace("{{customer}}", customer)
        .replace("{{month}}", month)
        .replace("{{users}}", json.ga.users)
        .replace("{{sessions}}", json.ga.sessions)
        .replace("{{rows}}", rows);

      const page = await browser.newPage();
      await page.setContent(html);

      await page.pdf({
        path: outputPath,
        format: "A4",
      });

      await page.close();

      console.log(`PDF生成: ${customer} ${month}`);
    }
  }

  await browser.close();
  console.log("全部完了 🎉");
}

generateAll();