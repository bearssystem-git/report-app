import fs from "fs";
import path from "path";
import Image from "next/image";
import GAChart from "@/app/components/GAChart";
import KPI from "@/app/components/KPI";
import Referrers from "@/app/components/Referrers";
import Devices from "@/app/components/Devices";
import users from "@/data/users.json"
import KPIHelpButton from "@/app/components/KPIHelpButton";
import PDFButton from "@/app/components/PDFButton";
import MonthSelector from "@/app/components/MonthSelector";
import LogoutButton from "@/app/components/LogoutButton";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Monitor,
  ShieldCheck,
  LogOut,
} from "lucide-react";

/* ================= ヘッダー ================= */

type HeaderProps = {
  month: string;
  domain: string;
  company: string;
};

function ReportHeader({
  month,
  domain,
  company,
}: HeaderProps) {
  // ===== 月末日取得 =====
  const [year, monthNum] = month
    .split("-")
    .map(Number);

  const lastDay = new Date(
    year,
    monthNum,
    0
  ).getDate();

  return (
    <div className="rounded-3xl bg-white px-12 py-10 shadow-sm relative overflow-hidden">

      {/* 左 */}
      <div>
        <div className="ml-2 text-ml text-slate-500 mb-5">
          {year}年{String(monthNum).padStart(2, "0")}月 保守レポート
        </div>

        <div 
          className="text-4xl font-bold tracking-tight mb-4 text-[#1f2a44]"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          ドメイン名：{domain}
        </div>

        <div className="ml-2 text-xl text-slate-500">
          期間：
          {year}年
          {String(monthNum).padStart(2, "0")}
          月1日 ～{" "}
          {year}年
          {String(monthNum).padStart(2, "0")}
          月
          {lastDay}
          日
        </div>
      </div>

      {/* 右下会社カード */}
      <div
        className="absolute bottom-5 right-5 flex items-center gap-1 rounded-3xl px-3 py-3"
        style={{
          background: "#e9eff3",
        }}
      >
        {/* ロゴ */}
        <div className="w-15 h-15 relative flex-shrink-0">
          <Image
            src="/logo.png"
            alt="logo"
            fill
            sizes="60px"
            className="object-contain rounded-full"
          />
        </div>

        {/* 会社名 */}
        <div className="text-2xl font-semibold tracking-tight text-[#1f2a44] whitespace-nowrap">
          株式会社BearsSystem
        </div>
      </div>
    </div>
  );
}

/* ================================================= */

/* ===== デフォルト ===== */
const defaultMaintenance = [
  { text: "ページの見切れ", status: "OK" },
  { text: "PC版レイアウトの崩れ", status: "OK" },
  { text: "スマートフォン版レイアウトの崩れ", status: "OK" },
  { text: "リンク切れ", status: "OK" },
  { text: "お問い合わせフォーム動作確認", status: "OK" },
  { text: "Google Analytics / Search Console確認", status: "OK" },
  { text: "サイトマップ更新", status: "OK" },
  { text: "WordPress セキュリティ確認", status: "OK" },
];

const defaultUpdates = [
  { title: "WordPress 6.4.3へ更新", desc: "定期メンテナンスとして実施しました。" },
  { title: "プラグイン更新", desc: "定期メンテナンスとして実施しました。" },
  { title: "テーマ更新", desc: "定期メンテナンスとして実施しました。" },
  { title: "セキュリティパッチ適用", desc: "定期メンテナンスとして実施しました。" },
  { title: "表示崩れ修正", desc: "定期メンテナンスとして実施しました。" },
  { title: "SEO設定見直し", desc: "定期メンテナンスとして実施しました。" },
];

export default async function Page({ params }: any) {
  const resolved = await params;

  const customer = resolved?.customer;
  const month = resolved?.month;
  const [year, currentMonth] = month
  .split("-")
  .map(Number);
  const prevMonth =
  currentMonth === 1
    ? 12
    : currentMonth - 1;
  const currentMonthLabel =
  `${currentMonth}月`;
  const prevMonthLabel =
  `${prevMonth}月`;
  const user = Object.values(users).find( (u: any) => u.customer === customer );
  const domain = user?.domain ?? customer;
  if (!customer || !month) {
    return <div>パラメータエラー</div>;
  }

  const gaPath = path.join(process.cwd(), "data", customer, `${month}-ga.json`);
  const reportPath = path.join(process.cwd(), "data", customer, `${month}-report.json`);
  const baseDir = path.join(process.cwd(), "data", customer);
  const monthFiles = fs
  .readdirSync(baseDir)
  .filter((file) => file.endsWith("-ga.json"))
  .map((file) => file.replace("-ga.json", ""))
  .sort()
  .reverse();

  if (!fs.existsSync(gaPath)) {
    return <div>GAデータがありません</div>;
  }

  const gaJson = JSON.parse(fs.readFileSync(gaPath, "utf-8"));
  const [y, m] = month
    .split("-")
    .map(Number);

  const prevDate = new Date(
    y,
    m - 2,
    1
  );

  const prevMonthFile =
    `${prevDate.getFullYear()}-${String(
      prevDate.getMonth() + 1
    ).padStart(2, "0")}`;

  let previousGaJson = {
    ga: [],
  };

  try {

    previousGaJson = JSON.parse(
      fs.readFileSync(
        path.join(
          process.cwd(),
          "data",
          customer,
          `${prevMonthFile}-ga.json`
        ),
        "utf-8"
      )
    );

  } catch {}
  
  let reportJson: any = {
    maintenance: defaultMaintenance,
    updates: defaultUpdates,
  };

  if (fs.existsSync(reportPath)) {
    // ③ 今月あり
    reportJson = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
  } else {
    // ② 過去探す
    if (fs.existsSync(baseDir)) {
      const files = fs
        .readdirSync(baseDir)
        .filter((f) => f.endsWith("-report.json"));

      if (files.length > 0) {
        const sorted = files.sort().reverse(); // 最新が先頭
        const latest = sorted[0];

        reportJson = JSON.parse(
          fs.readFileSync(path.join(baseDir, latest), "utf-8")
        );
      }
      // ① 1件もなければ default のまま
    }
  }

  const allOk = reportJson.maintenance.every((item: any) => item.status === "OK");

  const kpi = {
    current: gaJson?.kpi?.current ?? {},
    previous: gaJson?.kpi?.previous ?? {},
  };

return (
  <div className="flex min-h-screen bg-[#f1f5f9] text-slate-800">

    {/* ================= sidebar ================= */}

    <aside className="w-[280px] bg-white border-r border-slate-200 print:hidden flex flex-col">

      {/* logo */}
      <div className="px-8 py-10 border-b border-slate-200">

        <div className="flex items-center gap-4">

          <div className="relative w-[60px] h-[60px]">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              sizes="60px"
              className="object-contain rounded-full"
            />
          </div>

          <div>
            <div className="text-[24px] font-bold text-[#0f172a] leading-none">
              {user?.customer ?? customer}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              レポートダッシュボード
            </div>
          </div>

        </div>

      </div>

      {/* menu */}
      <div className="flex flex-col gap-2 p-4">

        <a href="#dashboard" className="flex items-center gap-4 rounded-2xl bg-[#eef4ff] px-5 py-4 text-[#2563eb] font-bold text-lg">

          <LayoutDashboard
            size={28}
            strokeWidth={2.3}
          />

          ダッシュボード

        </a>

        <a href="#monthly-report" className="flex items-center gap-4 rounded-2xl px-5 py-4 text-slate-700 hover:bg-slate-100 transition text-lg font-medium">

          <FileText
            size={28}
            strokeWidth={2.2}
          />

          月間推移

        </a>

        <a href="#statistics" className="flex items-center gap-4 rounded-2xl px-5 py-4 text-slate-700 hover:bg-slate-100 transition text-lg font-medium">

          <BarChart3
            size={28}
            strokeWidth={2.2}
          />

          統計データ

        </a>

        <a href="#devices" className="flex items-center gap-4 rounded-2xl px-5 py-4 text-slate-700 hover:bg-slate-100 transition text-lg font-medium">

          <Monitor
            size={28}
            strokeWidth={2.2}
          />

          デバイス・参照元

        </a>

        <a href="#maintenance" className="flex items-center gap-4 rounded-2xl px-5 py-4 text-slate-700 hover:bg-slate-100 transition text-lg font-medium">

          <ShieldCheck
            size={28}
            strokeWidth={2.2}
          />

          保守チェック項目

        </a>

      <LogoutButton />

      </div>

    </aside>

    {/* ================= main ================= */}

    <main className="flex-1 p-8">

    <MonthSelector customer={customer} currentMonth={month} months={monthFiles}/>

    <div className="mx-auto max-w-6xl space-y-6">

        {/* タイトル */}
        <div id="dashboard">
          <ReportHeader
            month={month}
            domain={user?.domain ?? customer}
            company={customer}
          />
        </div>

        {/* グラフ */}
        <div id="monthly-report" className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">
            月間推移
          </h2>

          <GAChart data={gaJson.ga} previousData={previousGaJson.ga} month={month}/>
        </div>

        {/* KPI */}
        <div id="statistics" className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex items-center gap-5 mb-4">

            <h2 className="text-xl font-bold">
              統計データ
            </h2>

            <KPIHelpButton />

          </div>

          <KPI data={kpi} />

        </div>

        {/* デバイス */}
        <div id="devices" className="rounded-3xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold mb-6">
            デバイスと参照元サイト
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div>

              <div className="font-bold mb-3">
                デバイス
              </div>

              <Devices data={gaJson.devices || []} />

            </div>

            <div>

              <div className="font-bold mb-3">
                参照元
              </div>

              <Referrers data={gaJson.referrers || []} />

            </div>

          </div>

        </div>

        {/* 上段 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* 保守チェック */}
          <div id="maintenance" className="rounded-3xl bg-white p-6 shadow-sm flex flex-col h-full">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-bold">
                保守チェック項目
              </h2>

              {allOk && (
                <span className="px-3 py-1 text-sm rounded-full bg-[#d0fae5] text-[#065f46]">
                  全項目確認済み
                </span>
              )}

            </div>

            <div className="flex flex-col gap-3 flex-1">

              {reportJson.maintenance.map((item: any, i: number) => (

                <div
                  key={i}
                  className="flex justify-between items-center border border-slate-200 px-4 py-3 rounded-xl text-base"
                >

                  <span>{item.text}</span>

                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      item.status === "OK"
                        ? "bg-[#d0fae5] text-[#065f46]"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* 対応内容 */}
          <div className="rounded-3xl bg-white p-6 shadow-sm flex flex-col h-full">

            <h2 className="text-xl font-bold mb-4">
              今月の対応内容
            </h2>

            <div className="flex flex-col gap-3 flex-1">

              {reportJson.updates.map((item: any, i: number) => (

                <div
                  key={i}
                  className="flex gap-4 border border-slate-200 px-4 py-3 rounded-xl text-base"
                >

                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold">
                    {i + 1}
                  </div>

                  <div>

                    <div className="font-semibold">
                      {item.title}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      {item.desc}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* footer */}
        <div className="rounded-3xl bg-white px-12 py-10 shadow-sm flex items-center justify-between">

          <div>

            <div className="text-3xl font-bold text-[#1f2a44] mb-5">
              今月もご利用ありがとうございました
            </div>

            <div className="text-xl text-slate-500">
              ご不明点や修正依頼がございましたら
              お気軽にご連絡ください
            </div>

          </div>

          <div className="text-right">

            <div className="text-2xl font-semibold text-[#1f2a44] mb-3">
              株式会社BearSystem
            </div>

            <div className="text-lg text-slate-500 mb-2">
              info@bears-sys.com
            </div>

            <div className="text-lg text-slate-500">
              080-3556-5644 / 043-214-7030
            </div>

          </div>

        </div>

      </div>

    </main>

  </div>
);
}