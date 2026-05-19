"use client";

import {
  useEffect,
  useState,
} from "react";

export default function Page() {
  const [list, setList] =
    useState<string[]>([]);

  const [input, setInput] =
    useState("");

  const fetchData = async () => {
    const res = await fetch(
      "/api/spam"
    );

    const data =
      await res.json();

    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addKeyword =
    async () => {
      if (!input) return;

      await fetch("/api/spam", {
        method: "POST",
        body: JSON.stringify({
          keyword: input,
        }),
      });

      setInput("");
      fetchData();
    };

  const deleteKeyword =
    async (keyword: string) => {
      await fetch("/api/spam", {
        method: "DELETE",
        body: JSON.stringify({
          keyword,
        }),
      });

      fetchData();
    };

  return (
    <div className="p-8 py-12 max-w-5xl mx-auto ml-[200px]">

      {/* タイトル */}
      <h1 className="text-4xl font-bold mb-10">
        スパム管理
      </h1>

      {/* 入力 */}
      <div className="flex gap-3 mb-8">

        <input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="spamキーワード"
          className="
            flex-1
            h-[48px]
            px-4
            rounded-xl
            border
            border-slate-300
            bg-white
            outline-none
          "
        />

        <button
          onClick={addKeyword}
          className="
            h-[48px]
            px-6
            rounded-xl
            bg-blue-500
            hover:bg-blue-600
            text-white
            font-semibold
            transition
          "
        >
          追加
        </button>
      </div>

      {/* テーブル */}
      <div className="rounded-3xl overflow-hidden border border-slate-200">

        {/* ヘッダー */}
        <div
          className="
            grid
            grid-cols-[1fr_120px]
            bg-[#2c8fc0]
            px-6
            py-4
          "
        >
          <div>spamキーワード</div>
        </div>

        {/* 一覧 */}
        {list.map((item, index) => (
          <div
            key={index}
            className={`
              grid
              grid-cols-[1fr_120px]
              items-center
              px-6
              py-5
              border-t
              border-slate-200
              ${
                index % 2 === 0
                  ? "bg-[#d7edf8]"
                  : "bg-white"
              }
            `}
          >
            <div className="text-lg">
              {item}
            </div>

            <div className="text-right">
              <button
                onClick={() =>
                  deleteKeyword(
                    item
                  )
                }
                className="
                  text-red-500
                  hover:text-red-700
                  transition
                  font-medium
                "
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}