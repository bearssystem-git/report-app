import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";

export default async function Page({ params }: any) {
  // 🔥 ここ修正
  const { customer } = await params;

  const dirPath = path.join(process.cwd(), "data", customer);

  // フォルダ存在チェック
  if (!fs.existsSync(dirPath)) {
    return <div>データフォルダがありません</div>;
  }

  const files = fs.readdirSync(dirPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    return <div>レポートデータがありません</div>;
  }

  jsonFiles.sort().reverse();

  const latest = jsonFiles[0].replace(".json", "");

  redirect(`/report/${customer}/${latest}`);
}