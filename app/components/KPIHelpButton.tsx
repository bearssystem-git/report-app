"use client";

import { useState } from "react";

export default function KPIHelpButton() {
  const [open, setOpen] =
    useState(false);

  const terms = [
    {
      no: 1,
      title: "ユーザー数",
      desc: "期間中にWebサイトへ訪問したユーザー人数",
    },
    {
      no: 2,
      title: "新規ユーザー数",
      desc: "サイトに初めて訪問したユーザー人数",
    },
    {
      no: 3,
      title: "セッション数",
      desc: "期間中に訪問から離脱までの流れが何回あったかを集計した回数",
    },
    {
      no: 4,
      title: "ページビュー数",
      desc: (
        <>
          ユーザーがページを表示した回数
          <br />
          同じページを読み直した場合でもカウントします
        </>
      ),
    },
    {
      no: 5,
      title: "平均滞在時間",
      desc: "エンゲージメントの合計時間をユーザー数で割った時間",
    },
    {
      no: 6,
      title: "直帰率",
      desc: "エンゲージメントのなかったセッションの割合",
    },
  ];

  return (
    <>
      {/* ?ボタン */}
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          w-9 h-9
          rounded-full
          bg-slate-200
          hover:bg-slate-300
          text-slate-700
          font-bold
          text-lg
          transition
        "
      >
        ?
      </button>

      {/* モーダル */}
      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="
            fixed inset-0
            bg-black/40
            flex items-center justify-center
            z-50
            animate-fadeIn
            p-6
          "
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              bg-white
              rounded-[32px]
              w-full
              max-w-[1000px]
              max-h-[90vh]
              shadow-2xl
              animate-modal
              overflow-hidden
              flex flex-col
            "
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-10 py-8 border-b border-slate-200">

              <div>
                <div className="text-4xl font-black text-slate-800">
                  用語説明
                </div>

                <div className="text-slate-500 mt-2">
                  Google Analytics 指標説明
                </div>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                  w-12 h-12
                  rounded-full
                  hover:bg-slate-100
                  text-3xl
                  text-slate-500
                  transition
                "
              >
                ×
              </button>
            </div>

            {/* テーブル */}
            <div className="p-6 overflow-y-auto">

              <div className="overflow-hidden rounded-2xl border border-slate-200">

                {/* header */}
                <div className="grid grid-cols-[90px_280px_1fr] bg-cyan-700 text-white font-bold text-xl">

                  <div className="px-6 py-5 border-r border-white/30">
                    No
                  </div>

                  <div className="px-6 py-5 border-r border-white/30">
                    用語
                  </div>

                  <div className="px-6 py-5">
                    説明
                  </div>
                </div>

                {/* body */}
                {terms.map(
                  (item, index) => (
                    <div
                      key={item.no}
                      className={`
                        grid grid-cols-[90px_280px_1fr]
                        text-base
                        border-t border-slate-200
                        ${
                          index % 2 === 0
                            ? "bg-slate-50"
                            : "bg-white"
                        }
                      `}
                    >
                      <div className="px-6 py-4 border-r border-slate-200">
                        {item.no}
                      </div>

                      <div className="px-6 py-4 border-r border-slate-200 font-medium">
                        {item.title}
                      </div>

                      <div className="px-6 py-4 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* 補足 */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-7 border border-slate-200">

                <div className="text-base font-bold mb-5 text-slate-800">
                  エンゲージメントセッション
                </div>

                <ul className="space-y-2 text-sm leading-relaxed text-slate-700">

                  <li>
                    ・10秒以上継続したセッション
                  </li>

                  <li>
                    ・コンバージョンイベントが
                    1件以上発生したセッション
                  </li>

                  <li>
                    ・ページまたは画面の閲覧、
                    または視聴が2件以上発生したセッション
                  </li>

                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}