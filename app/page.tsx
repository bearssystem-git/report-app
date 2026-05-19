export default async function Page() {
  const res = await fetch("http://localhost:3000/data/ga.json", {
    cache: "no-store",
  });

  const data = await res.json();

  // 👇 GAデータ取り出し
  const users = data.rows?.[0]?.metricValues?.[0]?.value ?? 0;

  const stats = [
    { label: 'ユーザー数', value: users, sub: '前月 -' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">GAレポート</h1>
        </div>

        {/* KPI */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <span className="text-4xl font-bold">{item.value}</span>
              <p className="text-sm text-slate-400">{item.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}