"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {

  const router = useRouter();

  const handleLogout = () => {

    const ok = window.confirm(
      "ログアウトします。よろしいですか？"
    );

    if (!ok) return;

    router.push("/login");

  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        px-5
        py-4
        text-slate-500
        hover:bg-slate-100
        transition
        text-lg
        font-medium
        w-full
      "
    >

      <LogOut
        size={28}
        strokeWidth={2.2}
      />

      ログアウト

    </button>
  );
}