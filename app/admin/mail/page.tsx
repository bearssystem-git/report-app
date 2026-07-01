"use client";

import MailEditor from "@/app/components/MailEditor";
import {
  useEffect,
  useState,
} from "react";

export default function Page() {

  const [users, setUsers] =
    useState<any>({});
  const [target, setTarget] =
    useState("all");
  const [title, setTitle] =
    useState("");
  const [body, setBody] =
    useState("");
  const [ownCompany, setOwnCompany] =
    useState("");
  const [linkText, setLinkText] =
    useState("");
  const [linkUrl, setLinkUrl] =
    useState("");
  const [copied, setCopied] =
    useState(false);
  const [fromMail, setFromMail] =
    useState("info@bears-sys.com");
  const [senders, setSenders] =
    useState<any[]>([]);

  const [
    showSignaturePopup,
    setShowSignaturePopup,
    ] = useState(false);
  
  const [
    signature,
    setSignature,
    ] = useState("");

  const [
    showPreview,
    setShowPreview,
  ] = useState(false);

  const [bcc, setBcc] =
    useState("");

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState(
    "template1"
  );

  const [
    templates,
    setTemplates,
  ] = useState<any>({});

  // ===== 初期読込 =====
    useEffect(() => {

    fetch("/api/mail-senders")
      .then((res) => res.json())
      .then((data) => {
        setSenders(data);
      });

    fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {

          setUsers(data);

          // admin取得
          const adminUser =
            Object.values(data).find(
              (u: any) =>
                u.customer === "admin"
            ) as any;

          setOwnCompany(
            adminUser?.company ?? ""
          );

        });

fetch("/api/mail-template")
  .then((res) =>
    res.json()
  )
  .then((data) => {

    const loadedTemplates =
      data.templates ?? {};

    setTemplates(
      loadedTemplates
    );


    
    const selected =
      data.selectedTemplate ??
      "template1";

    setSelectedTemplate(
      selected
    );

    setTitle(
      loadedTemplates[
        selected
      ]?.title ?? ""
    );

    setBody(
      (
        loadedTemplates[
          selected
        ]?.body ?? ""
      ).replace(
        /\n/g,
        "<br>"
      )
    );

  });

      fetch("/api/signature")
        .then((res) =>
          res.json()
        )
        .then((data) => {

          setSignature(
            data.signature ?? ""
          );

        });

    }, []);

  useEffect(() => {

  const template =
    templates[
      selectedTemplate
    ];

  if (!template) {
    return;
  }

  setTitle(
    template.title ?? ""
  );

  setBody(
    template.body ?? ""
  );

}, [
  selectedTemplate,
  templates,
]);


  const saveVariables =
  async () => {

    await fetch(
      "/api/mail-variables",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({

          ownCompany,

        }),
      }
    );

    alert(
      "変数を保存しました"
    );

  };

  const saveSignature =
    async () => {

      await fetch(
        "/api/signature",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            signature,

          }),

        }
      );

      alert(
        "保存しました"
      );

  };

  const copyLink = async () => {

    const html =
      `<a href="${linkUrl}" target="_blank">${linkText}</a>&#8203;`;

    const blob = new Blob(
      [html],
      { type: "text/html" }
    );

    const data =
      [new ClipboardItem({
        "text/html": blob,
      })];

    await navigator.clipboard.write(
      data
    );

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);

  };
  

  // ===== 送信 =====
  const sendMail = async () => {

    // template保存
await fetch(
  "/api/mail-template",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({

      selectedTemplate,

      templates: {

        ...templates,

        [selectedTemplate]: {
          title,
          body:
            body

          .replace(
            /<p><\/p>/g,
            ""
          )

          .replace(
            /<p><br><\/p>/g,
            ""
          ),
        },

      },

    }),

  }
);

    // variables保存
    await fetch(
      "/api/mail-variables",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({

          ownCompany,

        }),
      }
    );

    // メール送信
    const sender =
      senders.find(
        (s) => s.email === fromMail
      );

    const res = await fetch(
      "/api/send-mail",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          fromMail,
          target,
          title,
          body,
          bcc,
          ownCompany,
          senderName: sender?.name,
        }),
      }
    );

    const data =
      await res.json();

    alert(
      data.message ??
      "送信しました"
    );

  };

  const allMonths: string[] = [];

  Object.values(users).forEach(
    (user: any) => {

      if (!user.customer) {
        return;
      }

      try {

        const fs =
          require("fs");

        const path =
          require("path");

        const dirPath =
          path.join(
            process.cwd(),
            "data",
            user.customer
          );

        if (
          !fs.existsSync(
            dirPath
          )
        ) {
          return;
        }

        const files =
          fs.readdirSync(
            dirPath
          );

        const gaFiles =
          files.filter(
            (f: string) =>
              f.endsWith(
                "-ga.json"
              )
          );

        gaFiles.forEach(
          (file: string) => {

            const month =
              file.replace(
                "-ga.json",
                ""
              );

            allMonths.push(
              month
            );

          }
        );

      } catch (e) {}

    }
  );

  allMonths.sort();

const now = new Date();
now.setMonth(now.getMonth() - 1);

const defaultMonth = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, "0")}`;

const latestMonth =
  allMonths[allMonths.length - 1] ?? defaultMonth;

  const [
    currentYear,
    currentMonth,
  ] = latestMonth.split("-");
  
  const year =
    String(
      now.getFullYear()
    );

  const month =
    String(
      now.getMonth()
    );

return (

    <div className="py-6 px-8 ml-[200px]"  style={{ zoom: 0.94, }}>

      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-10">
        メール送信
      </h1>

      {/* 横並び */}
      <div className="flex gap-6 items-start -mt-6">

        {/* メールカード */}
        <div
          className="
            flex-1
            max-w-[800px]
            bg-white
            rounded-3xl
            border
            border-slate-200
            px-10
            pb-2
            pt-7
            shadow-sm
          "
        >

          {/* 宛先 */}
          <div className="mb-2">


<div className="mb-4">
  <label className="text-lg font-bold mb-2 text-slate-800">
    差出人
  </label>

  <select
    value={fromMail}
    onChange={(e) =>
      setFromMail(e.target.value)
    }
    className="
      border
      rounded
      px-2
      py-1
      w-full
    "
  >

{senders.map((sender) => (
  <option
    key={sender.email}
    value={sender.email}
  >
    {sender.name}
    ({sender.email})
  </option>
))}

  </select>
</div>


            <div className="text-lg font-bold mb-2 text-slate-800">
              宛先
            </div>

            <select
              value={target}
              onChange={(e) =>
                setTarget(
                  e.target.value
                )
              }
              className="
                w-full
                h-[50px]
                rounded-2xl
                border
                border-slate-300
                px-5
                text-lg
                outline-none
                bg-white
              "
            >

              <option value="all">
                全選択
              </option>

              {Object.entries(users)
                .filter(
                  ([key]) =>
                    key !== "admin"
                )
                .map(
                (
                  [key, val]: any
                ) => (

                  <option
                    key={key}
                    value={key}
                  >
                    {val.company}
                  </option>

                )
              )}

            </select>

          </div>

          {/* タイトル */}
          <div className="mb-2">

            <div className="text-lg font-bold mb-2 text-slate-800">
              タイトル
            </div>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="
                w-full
                h-[50px]
                rounded-2xl
                border
                border-slate-300
                px-5
                text-lg
                outline-none
              "
            />

          </div>

          {/* BCC */}
<div className="mb-2">

  <div className="text-lg font-bold mb-2 text-slate-800">
    BCC
  </div>

  <input
    value={bcc}
    onChange={(e) =>
      setBcc(
        e.target.value
      )
    }
    className="
      w-full
      h-[50px]
      rounded-2xl
      border
      border-slate-300
      px-5
      text-lg
      outline-none
    "
  />

</div>
          {/* 本文 */}
          <div className="mb-10">

            <div className="text-lg font-bold mb-3 text-slate-800">
              本文
            </div>

            <MailEditor
              value={body}
              onChange={setBody}
            />

          </div>

          {/* ボタン */}
          <div className="flex justify-between items-center mt-2 relative -top-4">

  {/* left */}
  <select
    value={selectedTemplate}
    onChange={(e) =>
      setSelectedTemplate(
        e.target.value
      )
    }
    className="
      h-[45px]
      px-5
      rounded-2xl
      border
      border-slate-300
      bg-white
      text-lg
      font-bold
      outline-none
    "
  >

    <option value="template1">
      template1
    </option>

    <option value="template2">
      template2
    </option>

  </select>

  {/* right */}
  <div className="flex gap-3">

    <button
      onClick={() =>
        setShowPreview(true)
      }
      className="
        border
        border-slate-300
        bg-white
        hover:bg-slate-50
        transition
        text-slate-700
        text-lg
        font-bold
        rounded-2xl
        px-10
        h-[45px]
      "
    >
      プレビュー
    </button>

    <button
      onClick={sendMail}
      className="
        bg-[#1e8ec1]
        hover:bg-[#1879a5]
        transition
        text-white
        text-lg
        font-bold
        rounded-2xl
        px-10
        h-[45px]
        shadow-sm
      "
    >
      送信
    </button>

  </div>
 </div>


</div>

      {/* 右側 */}
      <div className=" w-[450px] flex flex-col">
      
      {/* リンク作成 */}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          p-6
          shadow-sm
          mb-6
          h-[300px]
        "
      >

        <div className="text-xl font-bold mb-5">
          リンク作成
        </div>

        {/* リンクテキスト */}
        <div className="mb-4">

          <div className="text-sm font-bold mb-2">
            リンクテキスト
          </div>

          <input
            value={linkText}
            onChange={(e) =>
              setLinkText(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-3
              py-2
              text-sm
              outline-none
            "
          />

        </div>

        {/* URL */}
        <div className="mb-5">

          <div className="text-sm font-bold mb-2">
            リンク先url
          </div>

          <div className="relative pb-[60px]">

          <input
            value={linkUrl}
            onChange={(e) =>
              setLinkUrl(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-3
              py-2
              text-sm
              outline-none
            "
          />

        <div
          className="
            absolute
            right-0
            bottom-0
            flex
           items-center
            gap-3
          "
        >

          {copied && (

            <div
              className="
                text-xs
                bg-black
                text-white
                rounded-lg
                px-3
                py-2
              "
            >
              Copied!
            </div>

          )}

          <button
            onClick={copyLink}
            className="
              h-[40px]
              px-6
              rounded-2xl
              bg-[#1e8ec1]
              hover:bg-[#1879a5]
              transition
              text-white
              text-sm
              font-bold
            "
          >
            copy
          </button>

          </div>

          </div>

        </div>

      </div>

      {/* 使用可能変数 */}
      <div
        className="
          h-fit
          bg-white
          rounded-3xl
          border
          border-slate-200
          p-6
          shadow-sm
        "
      >

        <div className="mb-5">

          <div className="text-xl font-bold">
            使用可能変数
          </div>

        </div>

        <div className="flex flex-col gap-3">

          {/* company */}
            <div className="bg-slate-100 rounded-xl p-3">

              <div className="text-sm mb-2">
                {"{%company%}"}
              </div>

              <div className="text-sm text-slate-700">
                送信先
              </div>

            </div>
          {/* person */}
            <div className="bg-slate-100 rounded-xl p-3">

              <div className="text-sm mb-2">
                {"{%person%}"}
              </div>

              <div className="text-sm text-slate-700">
                担当者名
              </div>

            </div>
          {/* year */}

          <div className="bg-slate-100 rounded-xl p-3">

            <div className="text-sm mb-2">
              {"{%year%}"}
            </div>

            <div className="text-sm text-slate-700">
              {currentYear}
            </div>

          </div>

          {/* month */}
          <div className="bg-slate-100 rounded-xl p-3">

            <div className="text-sm mb-2">
              {"{%month%}"}
            </div>

            <div className="text-sm text-slate-700">
              {currentMonth}
            </div>

          </div>

          {/* ownCompany */}
          <div className="bg-slate-100 rounded-xl p-3">

            <div className="text-sm mb-2">
              {"{%ownCompany%}"}
            </div>

            <div className="text-sm text-slate-700">
              {ownCompany}
            </div>

          </div>

          {/* signature */}
          <div className="bg-slate-100 rounded-xl p-3 relative">

            <div className="text-sm mb-2">
              {"{%signature%}"}
            </div>

            <div className="text-sm text-slate-700">
              メール署名
            </div>

            <button
              onClick={() =>
                setShowSignaturePopup(
                  true
                )
              }
              className="
                absolute
                top-6
                right-3
                w-6
                h-6
                rounded-full
                bg-[#1e8ec1]
                text-white
                text-xs
                font-bold
                hover:bg-[#1879a5]
              "
            >
              !
            </button>

          </div>
          
            </div>

          </div>

        </div>

      
    </div>

  

    {showSignaturePopup && (

      <div
        className="
          fixed
          inset-0
          bg-black/30
          flex
          items-center
          justify-center
          z-50
        "
      >

        <div
          className="
            w-[600px]
            bg-white
            rounded-3xl
            p-8
            shadow-xl
          "
        >

          <div className="text-2xl font-bold mb-6">
            署名編集
          </div>

          <textarea
            value={signature}
            onChange={(e) =>
              setSignature(
                e.target.value
              )
            }
            className="
              w-full
              h-[300px]
              rounded-2xl
              border
              border-slate-300
              p-4
              outline-none
              resize-none
            "
          />

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={() =>
                setShowSignaturePopup(
                  false
                )
              }
              className="
                px-6
                h-[44px]
                rounded-xl
                border
              "
            >
              閉じる
            </button>

            <button
              onClick={saveSignature}
              className="
                px-6
                h-[44px]
                rounded-xl
                bg-[#1e8ec1]
                text-white
                font-bold
              "
            >
              保存
            </button>

          </div>

        </div>

      </div>

    )}

{showPreview && (

  <div
    className="
      fixed
      inset-0
      bg-black/30
      flex
      items-center
      justify-center
      z-50
    "
  >

    <div
      className="
        w-[900px]
        bg-white
        rounded-3xl
        p-10
        shadow-xl
      "
    >

      <div className="text-3xl font-bold mb-8">
        メールプレビュー
      </div>

      <div className="mb-6">

        <div className="text-sm text-slate-500 mb-2">
          件名
        </div>

        <div className="text-2xl font-bold">
          {title}
        </div>

      </div>

      <div
        className="
          border
          border-slate-200
          rounded-2xl
          p-6
          max-w-none
          text-[16px]
          leading-[1.4]
          [&_p]:m-0
          [&_p]:leading-[1.4]
          [&_a]:text-blue-600
          [&_a]:underline
        "
dangerouslySetInnerHTML={{
  __html:
    body

      .replace(
        /{%company%}/g,

        target === "all"

          ? "複数社"

          : users[target]
              ?.company ?? ""
      )

      .replace(
        /{%person%}/g,

        target === "all"
          ? "ご担当者様"
          : users[target]
              ?.person ?? ""
      )

      .replace(
        /{%year%}/g,
        year
      )

      .replace(
        /{%month%}/g,
        month
      )

      .replace(
        /{%ownCompany%}/g,
        ownCompany
      )

      .replace(
        /{%signature%}/g,
        signature.replace(
          /\n/g,
          "<br>"
        )
      )

      .replace(
        /\n\n/g,
        "<br><br>"
      ),
}}
      />

      <div className="flex justify-end mt-8">

        <button
          onClick={() =>
            setShowPreview(
              false
            )
          }
          className="
            px-8
            h-[50px]
            rounded-2xl
            bg-[#1e8ec1]
            text-white
            font-bold
          "
        >
          閉じる
        </button>

      </div>

    </div>

  </div>

)}
</div>
  );

}