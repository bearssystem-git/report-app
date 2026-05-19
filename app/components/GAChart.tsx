"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  data: any[];
  previousData: any[];
  month: string;
};

function getMonthLabel(offset: number) {
  const now = new Date();

  const target = new Date(
    now.getFullYear(),
    now.getMonth() - offset,
    1
  );

  return `${target.getMonth() + 1}月`;
}

export default function GAChart({
  data,
  previousData,
  month,
}: Props) {

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

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-400">
        データがありません
      </div>
    );
  }

  // ===== 今月 =====
  
  const currentTarget = new Date(
    year,
    currentMonth - 1,
    1
  );

  // ===== 前月 =====
  const previousTarget = new Date(
    year,
    currentMonth - 2,
    1
  );

  // ===== 今月データ =====
  const currentFiltered = data.filter((d) => {
    if (!d?.date) return false;

    const date = new Date(
      Number(d.date.slice(0, 4)),
      Number(d.date.slice(4, 6)) - 1,
      Number(d.date.slice(6, 8))
    );

    return (
      date.getFullYear() ===
        currentTarget.getFullYear() &&
      date.getMonth() ===
        currentTarget.getMonth()
    );
  });

  // ===== 前月データ =====
  const previousFiltered = data.filter((d) => {
    if (!d?.date) return false;

    const date = new Date(
      Number(d.date.slice(0, 4)),
      Number(d.date.slice(4, 6)) - 1,
      Number(d.date.slice(6, 8))
    );

    return (
      date.getFullYear() ===
        previousTarget.getFullYear() &&
      date.getMonth() ===
        previousTarget.getMonth()
    );
  });

  // ===== 並び替え =====
  const currentSorted = [...currentFiltered].sort(
    (a, b) =>
      a.date.localeCompare(b.date)
  );

  const previousSorted = [
    ...previousFiltered,
  ].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

// ===== グラフ用 =====
  const currentChartData =
    currentSorted.map((d) => ({
      label: d.date.slice(6, 8),
      users: Number(d.current ?? 0),
    }));

  const previousChartData =
    previousData.map((d) => ({
      label: d.date.slice(6, 8),
      users: Number(d.current ?? 0),
    }));

  return (
    <div
      className="w-full"
      style={{
        minWidth: 0,
      }}
    >
    
      {/* ===== 今月 ===== */}
      <div className="mb-12">
        <div className="mb-4">
          <div
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#6aa84f",
            }}
          >
            ホームページに訪れたユーザー数
          </div>

          <div className="mt-5 ml-4 mb-4 text-lg text-[#1f2a44]">
            {currentMonthLabel}
          </div>
        </div>

        <div
          className="flex justify-center"
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <div
            style={{
              width: 1100,
              height: 300,
            }}
          >
            <AreaChart
              width={1100}
              height={300}
              data={currentChartData}
            >
              <XAxis
                dataKey="label"
                interval={2}
                padding={{
                  left: 10,
                  right: 20,
                }}
              />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                fill="#93c5fd"
                fillOpacity={0.3}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </div>
        </div>
      </div>

      {/* ===== 前月 ===== */}
      <div>
        <div className="mt-5 ml-4 mb-4 text-lg text-[#1f2a44]">
          {prevMonthLabel}
        </div>

        <div
          className="flex justify-center"
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <div
            style={{
              width: 1100,
              height: 300,
            }}
          >
            <AreaChart
              width={935}
              height={255}
              data={previousChartData}
            >
              <XAxis
                dataKey="label"
                interval={2}
                padding={{
                  left: 10,
                  right: 20,
                }}
              />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="users"
                stroke="#94a3b8"
                fill="#93c5fd"
                fillOpacity={0.3}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </div>
        </div>
      </div>
    </div>
  );
}