"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type OS = {
  name: string;
  users: number;
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#10b981",
];

export default function OSChart({
  data,
}: {
  data: OS[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-400">
        データがありません
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <PieChart
        width={500}
        height={300}
      >
        <Pie
          data={data}
          dataKey="users"
          nameKey="name"
          cx={180}
          cy={140}
          outerRadius={100}
          isAnimationActive={false}
          label={({ value }) => value}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={
                COLORS[
                  i % COLORS.length
                ]
              }
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(
            value,
            entry,
            index
          ) => {
            const item =
              data[index];

            return `${value} : ${
              item?.users ?? 0
            }`;
          }}
        />
      </PieChart>
    </div>
  );
}