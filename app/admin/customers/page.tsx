"use client";

import {
  useState,
  useEffect,
} from "react";

export default function Page() {

  const [id, setId] =
    useState("");

  const [pass, setPass] =
    useState("");

  const [customer, setCustomer] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [person, setPerson] =
    useState("");

  const [domain, setDomain] =
    useState("");

  const [gaId, setGaId] =
    useState("");

  const [list, setList] =
    useState<any>({});

  useEffect(() => {

    fetch("/api/users")
      .then((res) => res.json())
      .then(setList);

  }, []);

  const save = async (
    data: any
  ) => {

    setList(data);

    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

  };

  const add = () => {

    const newData = {

      ...list,

      [id]: {

        password: pass,
        customer: customer,
        company: company,
        email: email,
        person: person,
        domain: domain,
        gaId: gaId,

      },

    };

    save(newData);

    setId("");
    setPass("");
    setCustomer("");
    setCompany("");
    setEmail("");
    setPerson("");
    setDomain("");
    setGaId("");

  };

  const remove = (
    key: string
  ) => {

    const newData = {
      ...list,
    };

    delete newData[key];

    save(newData);

  };

  return (

    <div className="p-8 py-10 max-w-[1600px] mr-auto ml-[100px]">

      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-8">
        顧客管理
      </h1>

      {/* 入力 */}
      <div className="grid grid-cols-[120px_120px_150px_200px_200px_120px_180px_150px_80px] gap-3 mb-8 text-[15px] items-center">

        <input
          placeholder="ID"
          value={id}
          onChange={(e) =>
            setId(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <input
          placeholder="パスワード"
          value={pass}
          onChange={(e) =>
            setPass(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <input
          placeholder="顧客名"
          value={customer}
          onChange={(e) =>
            setCustomer(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <input
          placeholder="会社名"
          value={company}
          onChange={(e) =>
            setCompany(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <input
          placeholder="メールアドレス"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <input
          placeholder="担当者名"
          value={person}
          onChange={(e) =>
            setPerson(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <input
          placeholder="ドメイン名"
          value={domain}
          onChange={(e) =>
            setDomain(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <input
          placeholder="GAプロパティID"
          value={gaId}
          onChange={(e) =>
            setGaId(
              e.target.value
            )
          }
          className="border border-slate-300 rounded-xl px-4 h-[48px]"
        />

        <button
          onClick={add}
          className="
            w-fit
            bg-blue-500
            hover:bg-blue-600
            transition
            text-white
            px-6
            h-[42px]
            rounded-xl
            font-semibold
            text-sm
          "
        >
          追加
        </button>

      </div>

      {/* 一覧 */}
      <div className="rounded-3xl border border-slate-200 overflow-hidden">

        {/* ヘッダー */}
        <div className="grid grid-cols-[120px_120px_160px_220px_230px_140px_180px_140px_80px] bg-[#1e8ec1] px-6 py-4 font-bold text-slate-700">

          <div>ID</div>

          <div>パスワード</div>

          <div>顧客名</div>

          <div>会社名</div>

          <div>メールアドレス</div>

          <div>担当者名</div>

          <div>ドメイン</div>

          <div>GA ID</div>

          <div></div>

        </div>

        {/* データ */}
        {Object.entries(list).map(
          (
            [key, val]: any,
            index
          ) => (

            <div
              key={key}
              className={`
                grid
                grid-cols-[120px_120px_160px_220px_230px_140px_180px_140px_80px]
                px-6
                py-4
                border-t
                border-slate-200
                items-center
                ${
                  index % 2 === 0
                    ? "bg-[#c0e6f5]"
                    : "bg-[#ffffff]"
                }
              `}
            >

              <div>
                {key}
              </div>

              <div>
                {val.password}
              </div>

              <div>
                {val.customer}
              </div>

              <div>
                {val.company}
              </div>

              <div className="truncate">
                {val.email}
              </div>

              <div>
                {val.person}
              </div>

              <div>
                {val.domain}
              </div>

              <div>
                {val.gaId}
              </div>

              <div className="text-right">

                <button
                  onClick={() =>
                    remove(key)
                  }
                  className="
                    text-red-500
                    hover:text-red-700
                  "
                >
                  削除
                </button>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );
}