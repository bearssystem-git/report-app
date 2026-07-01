import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div className="flex min-h-screen">

      {/* 左メニュー */}
      <aside
        style={{
          width: 320,
          background: "#fff",
          borderRight: "1px solid #dbe3e8",
          padding: "60px 50px",
        }}
      >

        {/* タイトル */}
        <h2
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 40,
            color: "#0f172a",
          }}
        >
          管理画面
        </h2>

        {/* メニュー */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >

          {/* レポート */}
          <Link
            href="/admin/report"
            style={{
              fontSize: 23,
              fontWeight: 600,
              color: "#0f172a",
              textDecoration: "none",
            }}
          >
            レポート作成
          </Link>

          {/* レポート更新 */}
          <Link
            href="/admin/report-update"
            style={{
              fontSize: 23,
              fontWeight: 600,
              color: "#0f172a",
              textDecoration: "none",
            }}
          >
            レポート更新
          </Link>

          {/* 顧客管理 */}
          <Link
            href="/admin/customers"
            style={{
              fontSize: 23,
              fontWeight: 600,
              color: "#0f172a",
              textDecoration: "none",
            }}
          >
            顧客管理
          </Link>

          {/* スパム */}
          <Link
            href="/admin/spam"
            style={{
              fontSize: 23,
              fontWeight: 600,
              color: "#0f172a",
              textDecoration: "none",
            }}
          >
            スパム管理
          </Link>

          {/* メール */}
          <Link
            href="/admin/mail"
            style={{
              fontSize: 23,
              fontWeight: 600,
              color: "#0f172a",
              textDecoration: "none",
            }}
          >
            メール
          </Link>

        </div>

      </aside>

      {/* メイン */}
      <main
        style={{
          flex: 1,
          padding: 45,
          background: "#e9eff3",
        }}
      >

        <div
          style={{
            width: "100%",
          }}
        >
          {children}
        </div>

      </main>

    </div>

  );

}