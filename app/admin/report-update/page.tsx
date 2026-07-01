"use client";

import { useEffect, useState } from "react";

export default function ReportUpdatePage() {

  const [lastUpdate, setLastUpdate] =
    useState("");

  useEffect(() => {

    fetch("/api/update-log")
      .then((res) => res.json())
      .then((data) => {
        setLastUpdate(data.lastUpdate);
      });

  }, []);

  const [updating, setUpdating] =
    useState(false);

  const updateGA = async () => {

    setUpdating(true);

    try {

      const res = await fetch(
        "/api/report-update",
        {
          method: "POST",
        }
      );

      const json = await res.json();

      if (json.success) {

        const logRes = await fetch(
          "/api/update-log"
        );

        const logData =
          await logRes.json();

        setLastUpdate(
          logData.lastUpdate
        );

        alert("更新完了");

      } else {

        alert("更新失敗");

      }

    } finally {

      setUpdating(false);

    }

  };

  return (
    <div className="p-8 py-12 max-w-7xl mr-auto ml-[200px]">

      <h1 className="text-4xl font-bold mb-10">
        レポート更新
      </h1>

      <div
        className="
          w-[900px]
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          p-10
        "
      >

        <button
          onClick={updateGA}
          className="
            h-[60px]
            px-10
            rounded-xl
            bg-blue-500
            hover:bg-blue-600
            text-white
            font-semibold
            text-lg
            transition
            whitespace-nowrap
            mb-8
          "
        >
            {updating
              ? "更新中..."
              : "GAデータ更新"}
        </button>

        <div
          className="
            w-[350px]
            border
            border-slate-300
            rounded-2xl
            p-6
          "
        >
          <div
            className="
              text-base
              text-slate-500
              mb-2
            "
          >
            最終更新
          </div>

          <div
            className="
              text-base
            "
          >
            {lastUpdate}
          </div>
        </div>

      </div>

    </div>
  );
}