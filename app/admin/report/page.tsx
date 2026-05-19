"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

export default function Page() {
  const [list, setList] =
    useState<any>({});

  const [customer, setCustomer] =
    useState("");

  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setList);
  }, []);

  const go = () => {
    if (!customer) {
      alert("顧客を選択してください");
      return;
    }

    // 固定月
    const month = "2026-04";

    router.push(
      `/admin/report/edit?customer=${customer}&month=${month}`
    );
  };

  return (
    <div className="p-8 py-12 max-w-7xl mr-auto ml-[200px]">

      {/* タイトル */}
      <h1 className="text-4xl font-bold mb-10">
        レポート作成
      </h1>

      {/* カード */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">

        {/* 入力エリア */}
        <div className="flex gap-4 items-center">

          {/* 顧客選択 */}
          <select
            value={customer}
            onChange={(e) =>
              setCustomer(
                e.target.value
              )
            }
            className="
              flex-1
              h-[52px]
              px-4
              rounded-xl
              border
              border-slate-300
              bg-white
              text-slate-700
              outline-none
            "
          >
            <option value="">
              顧客を選択してください
            </option>

            {Object.entries(
              list
            ).map(
              ([key, val]: any) =>
                val.customer !==
                  "admin" && (
                  <option
                    key={key}
                    value={
                      val.customer
                    }
                  >
                    {
                      val.customer
                    }
                  </option>
                )
            )}
          </select>

          {/* ボタン */}
          <button
            onClick={go}
            className="
              h-[52px]
              px-8
              rounded-xl
              bg-blue-500
              hover:bg-blue-600
              text-white
              font-semibold
              transition
              whitespace-nowrap
            "
          >
            レポートへ
          </button>
        </div>
      </div>
    </div>
  );
}