"use client";

type KPIData = {
  current: {
    users: number;
    newUsers?: number;
    sessions: number;
    pageviews: number;
    avgTime: number;
    bounceRate: number;
    sessionsPerUser?: number;
  };
  previous: {
    users: number;
    newUsers?: number;
    sessions: number;
    pageviews: number;
    avgTime: number;
    bounceRate: number;
    sessionsPerUser?: number;
  };
};

export default function KPI({
  data,
}: {
  data: KPIData;
}) {
  const c = data.current;
  const p = data.previous;

  return (
    <div
      className="grid grid-cols-4 gap-6 w-full items-stretch"
    >

      {/* ユーザー数 */}
      <Card
        title="ユーザー数"
        current={c.users}
        previous={p.users}
      />

      {/* 新規ユーザー数 */}
      <Card
        title="新規ユーザー数"
        current={c.newUsers ?? c.users}
        previous={p.newUsers ?? p.users}
      />

      {/* セッション */}
      <Card
        title="セッション数"
        current={c.sessions}
        previous={p.sessions}
      />

      {/* PV */}
      <Card
        title="PV数"
        current={c.pageviews}
        previous={p.pageviews}
      />

      {/* 滞在時間 */}
      <Card
        title="平均滞在時間"
        current={formatTime(c.avgTime)}
        previous={formatTime(p.avgTime)}
        isTime
      />

      {/* 直帰率 */}
      <Card
        title="直帰率"
        current={`${(
          c.bounceRate * 100
        ).toFixed(2)}%`}
        previous={`${(
          p.bounceRate * 100
        ).toFixed(2)}%`}
      />

      {/* 1ユーザーあたりセッション */}
      <Card
        title="1ユーザーあたりのセッション数"
        current={(
          c.sessionsPerUser ?? 0
        ).toFixed(2)}
        previous={(
          p.sessionsPerUser ?? 0
        ).toFixed(2)}
      />

    </div>
  );
}

function Card({
  title,
  current,
  previous,
  isTime = false,
}: {
  title: string;
  current: number | string;
  previous: number | string;
  isTime?: boolean;
}) {
  const diff =
    !isTime &&
    typeof current === "number" &&
    typeof previous === "number"
      ? current - previous
      : null;

  return (
    <div
      className="rounded-3xl h-full"
      style={{
        background: "#e9eff3",
        padding: 20,
        height: "100%",
      }}
    >
      <div
        style={{
          fontSize: 16,
          color: "#666",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 26,
          fontWeight: "bold",
        }}
      >
        {formatNumber(current)}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#888",
        }}
      >
        （前月 {formatNumber(previous)}）

        {diff !== null && (
          <span
            style={{
              color:
                diff >= 0
                  ? "green"
                  : "red",
              marginLeft: 8,
            }}
          >
            {diff >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(diff)}
          </span>
        )}
      </div>
    </div>
  );
}

// 秒 → 時間変換
function formatTime(sec: number) {
  const m = Math.floor(sec / 60);

  const s = Math.floor(sec % 60);

  return `00:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
}

function formatNumber(
  value: number | string
) {
  if (typeof value !== "number")
    return value;

  return value.toLocaleString();
}