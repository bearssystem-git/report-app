"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PDFButton from "@/app/components/PDFButton";

type Props = {
  customer: string;
  currentMonth: string;
  months: string[];
};

export default function MonthSelector({
  customer,
  currentMonth,
  months,
}: Props) {

  const router = useRouter();

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const handleMove = () => {

    if (!selectedMonth) return;

    router.push(
      `/report/${customer}/${selectedMonth}`
    );

  };

  return (
    <div className="ml-72 mb-6 flex items-center gap-2 print:hidden">

      {/* label */}
      <div
        className="
          h-[40px]
          px-10
          rounded-2xl
          bg-[#2b90c3]
          text-white
          text-[18px]
          font-medium
          flex
          items-center
          justify-center
          whitespace-nowrap
          shadow-sm
        "
      >
        表示する月
      </div>

      {/* select */}
      <select
        value={selectedMonth}
        onChange={(e) =>
          setSelectedMonth(e.target.value)
        }
        className="
          h-[40px]
          min-w-[350px]
          rounded-2xl
          border-[1px]
          border-[#082f49]
          bg-white
          px-10
          text-[20px]
          text-center
          font-medium
          text-slate-800
          outline-none
          appearance-none
        "
      >

        {months.map((m) => (

          <option
            key={m}
            value={m}
          >

            {m.split("-")[0]}年
            {m.split("-")[1]}月

          </option>

        ))}

      </select>

      {/* button */}
      <button
        onClick={handleMove}
        className="
          h-[40px]
          px-6
          rounded-2xl
          bg-[#2b90c3]
          text-white
          text-[18px]
          font-medium
          shadow-sm
          hover:bg-[#2179a5]
          transition
        "
      >
        表示
      </button>

      {/* pdf */}
      <PDFButton />

    </div>
  );
}