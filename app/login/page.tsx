"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [users, setUsers] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const login = () => {
    const user = users[id];

    if (!user || user.password !== pass) {
      alert("IDまたはパスワードが違います");
      return;
    }

    localStorage.setItem("login", JSON.stringify(user));

    // 🔥 表示する月（先月）
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const month =
      `${target.getFullYear()}-` +
      String(target.getMonth() + 1).padStart(2, "0");

    if (id === "admin") {
      router.push("/admin");
      return;
    }

    // 🔥 遷移
    router.push(`/report/${user.customer}/${month}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">ログイン</h1>

        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          className="border p-2 w-full mb-3"
        />

        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="パスワード"
          className="border p-2 w-full mb-4"
        />

        <button
          onClick={login}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          ログイン
        </button>
      </div>
    </div>
  );
}