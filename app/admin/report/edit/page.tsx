"use client";

import { useState } from "react";

type Maintenance = {
  text: string;
  status: "OK" | "NG";
};

type Update = {
  title: string;
  desc: string;
};

import { useSearchParams } from "next/navigation";

export default function Page() {

  const params = useSearchParams();
  const customer = params.get("customer");
  const [activeTab, setActiveTab] = useState<"check" | "update">("check");

  const [maintenanceItems, setMaintenanceItems] = useState<Maintenance[]>([
    { text: "ページの見切れ", status: "OK" },
    { text: "PC版レイアウトの崩れ", status: "OK" },
    { text: "スマートフォン版レイアウトの崩れ", status: "OK" },
    { text: "リンク切れ", status: "OK" },
    { text: "お問い合わせフォーム動作確認", status: "OK" },
    { text: "Google Analytics / Search Console確認", status: "OK" },
    { text: "サイトマップ更新", status: "OK" },
    { text: "WordPress セキュリティ確認", status: "OK" },
  ]);

  const [updateItems, setUpdateItems] = useState<Update[]>([
    { title: "WordPress 6.4.3へ更新", desc: "定期メンテナンスとして実施しました。" },
    { title: "プラグイン更新", desc: "定期メンテナンスとして実施しました。" },
    { title: "テーマ更新", desc: "定期メンテナンスとして実施しました。" },
    { title: "セキュリティパッチ適用", desc: "定期メンテナンスとして実施しました。" },
    { title: "表示崩れ修正", desc: "定期メンテナンスとして実施しました。" },
    { title: "SEO設定見直し", desc: "定期メンテナンスとして実施しました。" },
  ]);

  const save = async () => {
    const data = {
    maintenance: maintenanceItems,
    updates: updateItems,
  };

  const res = await fetch("/api/report/save", {
    method: "POST",
    body: JSON.stringify({
      customer,
      month: "2026-04",
      data,
    }),
  });

  const result = await res.json();

  if (result.success) {
    alert("保存しました");
  }
};

  // ===== 保守チェック =====
  const toggleStatus = (index: number) => {
    const newItems = [...maintenanceItems];
    newItems[index].status =
      newItems[index].status === "OK" ? "NG" : "OK";
    setMaintenanceItems(newItems);
  };

  const updateMaintenanceText = (index: number, value: string) => {
    const newItems = [...maintenanceItems];
    newItems[index].text = value;
    setMaintenanceItems(newItems);
  };

  const addMaintenance = () => {
    setMaintenanceItems([...maintenanceItems, { text: "", status: "OK" }]);
  };

  const deleteMaintenance = (index: number) => {
    setMaintenanceItems(maintenanceItems.filter((_, i) => i !== index));
  };

  // ===== 対応内容 =====
  const updateTitle = (index: number, value: string) => {
    const newItems = [...updateItems];
    newItems[index].title = value;
    setUpdateItems(newItems);
  };

  const updateDesc = (index: number, value: string) => {
    const newItems = [...updateItems];
    newItems[index].desc = value;
    setUpdateItems(newItems);
  };

  const addUpdate = () => {
    setUpdateItems([...updateItems, { title: "", desc: "" }]);
  };

  const deleteUpdate = (index: number) => {
    setUpdateItems(updateItems.filter((_, i) => i !== index));
  };

  return (
    <div className="grid gap-4 grid-cols-3 px-4 items-start">

      {/* ===== 編集エリア ===== */}
      <div className="rounded-3xl bg-white p-6 shadow-sm self-start">
        <h2 className="text-lg font-bold mb-4">編集エリア</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("check")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === "check"
                ? "bg-slate-900 text-white"
                : "bg-slate-200"
            }`}
          >
            保守チェック
          </button>

          <button
            onClick={() => setActiveTab("update")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === "update"
                ? "bg-slate-900 text-white"
                : "bg-slate-200"
            }`}
          >
            対応内容
          </button>
        </div>

        {/* ===== 保守チェック編集 ===== */}
        {activeTab === "check" && (
          <div>
            {maintenanceItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-3">
                <input
                  value={item.text}
                  onChange={(e) =>
                    updateMaintenanceText(i, e.target.value)
                  }
                  className="border border-slate-200 px-3 py-2 rounded-xl w-full text-sm"
                />

                <button
                  onClick={() => toggleStatus(i)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.status === "OK"
                      ? "bg-[#d0fae5] text-[#065f46]"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </button>

                <button
                  onClick={() => deleteMaintenance(i)}
                  className="text-red-500 text-xs"
                >
                  削除
                </button>
              </div>
            ))}

             <div className="mt-4 flex items-center justify-between">
              <button
                onClick={addMaintenance}
                className="text-blue-500 text-sm"
              >
                +追加
              </button>

              <button
                onClick={save}
                className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white"
              >
                保存
              </button>
            </div>
          </div>
        )}

        {/* ===== 対応内容編集 ===== */}
        {activeTab === "update" && (
          <div>
            {updateItems.map((item, i) => (
              <div key={i} className="mb-4">
                <input
                  value={item.title}
                  onChange={(e) => updateTitle(i, e.target.value)}
                  className="border border-slate-200 px-3 py-2 rounded-xl w-full mb-2 text-sm"
                />

                <textarea
                  value={item.desc}
                  onChange={(e) => updateDesc(i, e.target.value)}
                  className="border border-slate-200 px-3 py-2 rounded-xl w-full text-sm"
                />

                <div
                  onClick={() => deleteUpdate(i)}
                  className="text-red-500 text-xs mt-1 cursor-pointer"
                >
                  削除
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between items-center">
            <button onClick={addUpdate} className="text-blue-500 text-sm">
              +追加
            </button>
                          
            <button
                onClick={save}
                className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white"
            >
              保存
            </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== プレビュー ===== */}
      <div className="col-span-2 grid grid-cols-2 gap-4 items-stretch">

        {/* 保守チェック表示 */}
        <div className="rounded-3xl bg-white p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold mb-4">保守チェック項目</h2>

          <div className="flex flex-col flex-1 justify-between space-y-3">
            {maintenanceItems.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center border border-slate-200 p-3 rounded-2xl text-sm"
              >
                <span>{item.text}</span>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
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

        {/* 対応内容表示 */}
        <div className="rounded-3xl bg-white p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold mb-4">今月の対応内容</h2>

          <div className="flex flex-col flex-1 justify-between space-y-3">
            {updateItems.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 border border-slate-200 p-3 rounded-2xl text-sm"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                  {i + 1}
                </div>

                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}