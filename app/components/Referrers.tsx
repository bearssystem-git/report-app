"use client";

type Referrer = {
  name: string;
  users: number;
};

export default function Referrers({ data }: { data?: Referrer[] }) {
  const safeData: Referrer[] =
    data && data.length > 0
      ? data
      : [
          { name: "(direct)", users: 118 },
          { name: "google", users: 24 },
          { name: "yahoo", users: 3 },
          { name: "bing", users: 2 },
          { name: "sales-crowd.jp", users: 2 },
          { name: "(not set)", users: 1 },
        ];

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <table
      style={{
        width: "95%",
        borderCollapse: "separate",
        borderSpacing: 0,
        tableLayout: "fixed",
        fontSize: 16,
      }}
    >
      <thead>
        <tr>
          <th style={thStyle(55)}>No</th>
          <th style={thStyle()}>参照元・メディア</th>
          <th style={thStyle(105)}>ユーザー数</th>
        </tr>
      </thead>

      <tbody>
        {safeData.map((d, i) => (
          <tr key={i}>
            <td style={tdStyle(i, 60, true)}>{i + 1}</td>

            <td style={tdStyle(i)}>
              {convertName(d.name)}
            </td>

            <td style={tdStyle(i, 120, true)}>
              {d.users}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

// 🔹 ヘッダー（グラデーション）
const thStyle = (width?: number) => ({
  padding: "14px 10px",
  color: "#fff",
  fontWeight: "bold",
  textAlign: "center" as const,
  width: width ? width : "auto",
  background: "linear-gradient(135deg, #398197, #398197)",
  borderRight: "3px solid #fff",
  borderBottom: "3px solid #fff",
});

// 🔹 セル（ストライプ）
const tdStyle = (index: number, width?: number, right?: boolean) => ({
  padding: "14px 10px",
  width: width ? width : "auto",
  textAlign: right ? "right" : "left",
  background: index % 2 === 0 ? "#e9eff3" : "#d3e2e8",
  borderRight: "3px solid #fff",
  borderBottom: "3px solid #fff",
});

// 表示名変換
function convertName(name: string) {
  switch (name) {
    case "(direct)":
      return "EmailまたはQRコードからの流入";
    case "google":
      return "Googleからの検索";
    case "yahoo":
      return "Yahooからの検索";
    case "bing":
      return "Bingからの検索";
    case "(not set)":
      return "不明";
    default:
      return name;
  }
}