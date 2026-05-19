"use client";

export default function PDFButton() {
  return (
    <button
      onClick={() => window.print()}
      className="
        h-[40px]
        rounded-2xl
        bg-[#0284c7]
        px-8
        text-[18px]
        font-xl
        text-white
        hover:bg-sky-700
        transition
      "
    >
      PDFダウンロード
    </button>
  );
}