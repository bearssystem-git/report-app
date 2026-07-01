const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const USERS = JSON.parse(fs.readFileSync("./data/users.json"));

// ===== 対象月 =====
function getTargetMonth() {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
}

// ===== 日付範囲 =====
function getMonthRange(offset) {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() - offset + 1;

  const y = month <= 0 ? year - 1 : year;
  const m = month <= 0 ? 12 + month : month;

  const lastDay = new Date(y, m, 0).getDate();
  const mm = String(m).padStart(2, "0");

  return {
    startDate: `${y}-${mm}-01`,
    endDate: `${y}-${mm}-${lastDay}`,
  };
}

async function main() {
  const auth =
  new google.auth.GoogleAuth({
    keyFile:
      "./keys/ga-service-account.json",

    scopes: [
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });

  const analyticsData = google.analyticsdata({
    version: "v1beta",
    auth,
  });

  const currentRange = getMonthRange(1);
  const previousRange = getMonthRange(2);
  const month = getTargetMonth();

  // ===== ここがループ =====
  for (const key in USERS) {
    const user = USERS[key];

    // 🔥【追加済】gaIdないユーザーはスキップ
    if (!user.gaId) {
      console.log(`⏭ スキップ: ${key}（gaIdなし）`);
      continue;
    }

    console.log(`📊 取得中: ${key}`);

    // ===== 推移 =====
    const current = await analyticsData.properties.runReport({
      property: `properties/${user.gaId}`,
      requestBody: {
        dateRanges: [currentRange],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
      },
    });

    const previous = await analyticsData.properties.runReport({
      property: `properties/${user.gaId}`,
      requestBody: {
        dateRanges: [previousRange],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
      },
    });

    const currentData = (current.data.rows || []).map((r) => ({
      date: r.dimensionValues[0].value,
      current: Number(r.metricValues[0].value),
    }));

    const prevData = (previous.data.rows || []).map((r) => ({
      date: r.dimensionValues[0].value,
      previous: Number(r.metricValues[0].value),
    }));

    currentData.sort((a, b) => a.date.localeCompare(b.date));
    prevData.sort((a, b) => a.date.localeCompare(b.date));

    // ===== マージ =====
    const prevMap = {};
    prevData.forEach((p) => {
      prevMap[p.date] = p.previous;
    });

    const merged = currentData.map((c) => ({
      date: c.date,
      current: c.current,
      previous: prevMap[c.date] || 0,
    }));

    // ===== KPI =====
    const currentKPI = await analyticsData.properties.runReport({
      property: `properties/${user.gaId}`,
      requestBody: {
        dateRanges: [currentRange],
        metrics: [
          { name: "totalUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
          { name: "sessionsPerUser" },
        ],
      },
    });

    const previousKPI = await analyticsData.properties.runReport({
      property: `properties/${user.gaId}`,
      requestBody: {
        dateRanges: [previousRange],
        metrics: [
          { name: "totalUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
          { name: "sessionsPerUser" },
        ],
      },
    });

    const cVals = currentKPI.data.rows?.[0]?.metricValues || [];
    const pVals = previousKPI.data.rows?.[0]?.metricValues || [];

    const kpi = {
      current: {
        users: Number(cVals[0]?.value || 0),
        newUsers: Number(cVals[1]?.value || 0),
        sessions: Number(cVals[2]?.value || 0),
        pageviews: Number(cVals[3]?.value || 0),
        avgTime: Number(cVals[4]?.value || 0),
        bounceRate: Number(cVals[5]?.value || 0),
        sessionsPerUser: Number(cVals[6]?.value || 0),
      },
      previous: {
        users: Number(pVals[0]?.value || 0),
        newUsers: Number(pVals[1]?.value || 0),
        sessions: Number(pVals[2]?.value || 0),
        pageviews: Number(pVals[3]?.value || 0),
        avgTime: Number(pVals[4]?.value || 0),
        bounceRate: Number(pVals[5]?.value || 0),
        sessionsPerUser: Number(pVals[6]?.value || 0),
      },
    };

    // ===== 保存 =====
    const outputDir = path.join(process.cwd(), "data", user.customer);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${month}-ga.json`);

    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          ga: merged,
          kpi,
        },
        null,
        2
      )
    );

    console.log("✅ 出力:", outputPath);
  }
}

main();