"use client";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import {
  useEffect,
} from "react";

import StarterKit from "@tiptap/starter-kit";

import HardBreak from "@tiptap/extension-hard-break";

import Link from "@tiptap/extension-link";

import Underline from "@tiptap/extension-underline";

import TextAlign from "@tiptap/extension-text-align";

type Props = {
  value: string;

  onChange: (
    value: string
  ) => void;
};

export default function MailEditor({
  value,
  onChange,
}: Props) {

  const editor = useEditor({

    immediatelyRender: false,

    extensions: [

      StarterKit.configure({

        hardBreak: false,

      }),

      HardBreak.extend({

        addKeyboardShortcuts() {

          return {

            Enter: () =>
              this.editor.commands
                .setHardBreak(),

          };

        },

      }),

      Underline,

      Link.configure({

        openOnClick: false,

      }),

      TextAlign.configure({

        types: [
          "heading",
          "paragraph",
        ],

      }),

    ],

    content: value,

    onUpdate({
      editor,
    }) {

      onChange(
        editor.getHTML()
      );

    },

  });

  useEffect(() => {

    if (
      editor &&
      value !==
        editor.getHTML()
    ) {

      editor.commands.setContent(
        value
      );

    }

  }, [
    value,
    editor,
  ]);

  if (!editor) {
    return null;
  }

  return (

    <div
      className="
        border
        border-slate-300
        rounded-2xl
        overflow-hidden
        bg-white
      "
    >

      {/* toolbar */}
      <div
        className="
          flex
          flex-wrap
          gap-2
          p-3
          border-b
          border-slate-200
          bg-slate-50
        "
      >

        {/* bold */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className="
            px-3
            py-1
            rounded-lg
            border
            text-sm
            font-bold
            hover:bg-slate-100
          "
        >
          B
        </button>

        {/* italic */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className="
            px-3
            py-1
            rounded-lg
            border
            text-sm
            italic
            hover:bg-slate-100
          "
        >
          I
        </button>

        {/* underline */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
          className="
            px-3
            py-1
            rounded-lg
            border
            text-sm
            underline
            hover:bg-slate-100
          "
        >
          U
        </button>

        {/* left */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign(
                "left"
              )
              .run()
          }
          className="
            px-3
            py-1
            rounded-lg
            border
            text-sm
            hover:bg-slate-100
          "
        >
          左
        </button>

        {/* center */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign(
                "center"
              )
              .run()
          }
          className="
            px-3
            py-1
            rounded-lg
            border
            text-sm
            hover:bg-slate-100
          "
        >
          中央
        </button>

        {/* right */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign(
                "right"
              )
              .run()
          }
          className="
            px-3
            py-1
            rounded-lg
            border
            text-sm
            hover:bg-slate-100
          "
        >
          右
        </button>

        {/* bullet */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className="
            px-3
            py-1
            rounded-lg
            border
            text-sm
            hover:bg-slate-100
          "
        >
          ・
        </button>

      </div>

      {/* editor */}
      <EditorContent
        editor={editor}
        className="
          min-h-[300px]
          px-5
          pt-3
          pb-8
          max-w-none
          outline-none
          whitespace-pre-wrap

          [&_a]:text-blue-600
          [&_a]:underline

          [&_.ProseMirror]:border-0
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:leading-[1.4]

          [&_.ProseMirror_p]:m-0
        "
      />

    </div>

  );

}