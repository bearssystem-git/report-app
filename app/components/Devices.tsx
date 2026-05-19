"use client";

import { PieChart, Pie, Cell } from "recharts";

type Device = {
  name: string;
  users: number;
};

const COLORS = [
  "#8fb6c1", // Windows
  "#e6cc7a", // Mac
  "#4f8d99", // Linux
  "#a35c7a", // iOS
  "#e76f51", // Android
  "#f4a261", // Chrome OS
];

export default function Devices({
  data,
}: {
  data?: Device[];
}) {
  const safeData: Device[] =
    data && data.length > 0
      ? data
      : [
          { name: "Windows", users: 121 },
          { name: "Mac", users: 15 },
          { name: "Linux", users: 12 },
          { name: "iOS", users: 7 },
          { name: "Android", users: 1 },
          { name: "Chrome OS", users: 1 },
        ];

  // ===== グループ分け =====
  const isPC = (name: string) =>
    [
      "Windows",
      "Mac",
      "Linux",
      "Chrome OS",
    ].includes(name);

  const isMobile = (name: string) =>
    ["iOS", "Android"].includes(name);

  // ===== 合計 =====
  const totalPC = safeData
    .filter((d) => isPC(d.name))
    .reduce((sum, d) => sum + d.users, 0);

  const totalMobile = safeData
    .filter((d) => isMobile(d.name))
    .reduce((sum, d) => sum + d.users, 0);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* 円グラフ */}
      <div
        style={{
          position: "relative",
          width: 350,
          height: 500,
          flexShrink: 0,
        }}
      >
        <PieChart
          width={350}
          height={500}
        >
          <Pie
            data={safeData}
            cx={160}
            cy={180}
            outerRadius={120}
            dataKey="users"
            nameKey="name"
            isAnimationActive={false}
            label={(props: any) => {
              const {
                cx,
                cy,
                midAngle,
                outerRadius,
                index,
              } = props;

              const RADIAN = Math.PI / 180;

              let radius =
                outerRadius + 40;

              // ===== 上方向補正 =====
              let offsetY = 0;

              if (
                midAngle > 60 &&
                midAngle < 120
              ) {
                offsetY = -30;
              } else if (
                midAngle >= 120 &&
                midAngle < 180
              ) {
                offsetY = -20;
              } else if (
                midAngle > 0 &&
                midAngle <= 60
              ) {
                offsetY = -20;
              }

              const x =
                cx +
                radius *
                  Math.cos(
                    -midAngle * RADIAN
                  );

              const y =
                cy +
                radius *
                  Math.sin(
                    -midAngle * RADIAN
                  ) +
                offsetY;

              const name =
                safeData[index]?.name ??
                "";

              const value =
                safeData[index]?.users ??
                0;

              const group = isPC(name)
                ? "PC"
                : "スマホ";

              const total = isPC(name)
                ? totalPC
                : totalMobile;

              const percent =
                total > 0
                  ? (
                      (value / total) *
                      100
                    ).toFixed(2)
                  : "0";

              return (
                <g>
                  {/* 線 */}
                  <line
                    x1={
                      cx +
                      outerRadius *
                        Math.cos(
                          -midAngle *
                            RADIAN
                        )
                    }
                    y1={
                      cy +
                      outerRadius *
                        Math.sin(
                          -midAngle *
                            RADIAN
                        )
                    }
                    x2={x}
                    y2={y}
                    stroke="#999"
                  />

                  {/* 背景 */}
                  <rect
                    x={x - 55}
                    y={y - 18}
                    width={110}
                    height={30}
                    rx={6}
                    fill="#333"
                  />

                  {/* テキスト */}
                  <text
                    x={x}
                    y={y + 5}
                    fill="#fff"
                    fontSize={12}
                    textAnchor="middle"
                  >
                    {group} : {name},{" "}
                    {percent}%
                  </text>
                </g>
              );
            }}
          >
            {safeData.map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              )
            )}
          </Pie>
        </PieChart>

        {/* 下影 */}
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 160,
            transform:
              "translateX(-50%)",
            width: 200,
            height: 40,
            background:
              "rgba(0,0,0,0.2)",
            borderRadius: "50%",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* 凡例 */}
      <div
        style={{
          marginLeft: -20,
          background: "#f5f5f5",
          padding: "15px 20px",
          borderRadius: 10,
          flexShrink: 0,
        }}
      >
        {safeData.map((d, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display:
                  "inline-block",
                width: 12,
                height: 12,
                background:
                  COLORS[
                    i % COLORS.length
                  ],
                marginRight: 8,
              }}
            />

            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}