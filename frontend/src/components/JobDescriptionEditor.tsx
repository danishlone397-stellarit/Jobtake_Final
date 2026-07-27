"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

type JobDescriptionEditorProps = {
  number: number;
  title: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
};

const buttonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-100";

export function JobDescriptionEditor({
  number,
  title,
  helper,
  value,
  onChange,
  placeholder,
  required = true,
}: JobDescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialValue = useRef(value);
  const [charCount, setCharCount] = useState(0);
  const [empty, setEmpty] = useState(!value);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = initialValue.current;
    setCharCount(el.textContent?.length ?? 0);
    setEmpty(!(el.textContent?.trim()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emitChange() {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeHtml(el.innerHTML);
    setCharCount(el.textContent?.length ?? 0);
    setEmpty(!(el.textContent?.trim()));
    onChange(html);
  }

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitChange();
  }

  function applyBlockFormat(format: string) {
    if (format === "heading") exec("formatBlock", "h2");
    else if (format === "quote") exec("formatBlock", "blockquote");
    else exec("formatBlock", "p");
  }

  function insertLink() {
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;
    exec("createLink", url);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <label className="block text-sm font-bold text-zinc-900">
        {number}. {title} {required && <span className="text-red-500">*</span>}
      </label>
      <p className="mt-2 text-sm font-medium leading-5 text-zinc-500">{helper}</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <div className="flex min-h-10 flex-wrap items-center gap-1 border-b border-zinc-200 bg-white px-2 py-1">
          <select
            aria-label="Text style"
            className="h-9 rounded-md border-0 bg-transparent px-2 pr-8 text-sm font-medium text-zinc-600 outline-none transition hover:bg-zinc-100 focus:ring-2 focus:ring-blue-100"
            defaultValue="paragraph"
            onChange={(event) => applyBlockFormat(event.target.value)}
          >
            <option value="paragraph">Paragraph</option>
            <option value="heading">Heading</option>
            <option value="quote">Quote</option>
          </select>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button type="button" className={buttonClass} title="Bold" aria-label="Bold" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")}>
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Italic" aria-label="Italic" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")}>
            <Italic className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Underline" aria-label="Underline" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("underline")}>
            <Underline className="h-4 w-4" />
          </button>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button type="button" className={buttonClass} title="Bullet list" aria-label="Bullet list" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertUnorderedList")}>
            <List className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Numbered list" aria-label="Numbered list" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertOrderedList")}>
            <ListOrdered className="h-4 w-4" />
          </button>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button type="button" className={buttonClass} title="Align left" aria-label="Align left" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyLeft")}>
            <AlignLeft className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Align center" aria-label="Align center" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyCenter")}>
            <AlignCenter className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Align right" aria-label="Align right" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyRight")}>
            <AlignRight className="h-4 w-4" />
          </button>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button
            type="button"
            className={buttonClass}
            title="Insert link"
            aria-label="Insert link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertLink}
          >
            <Link className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          {empty && (
            <p className="pointer-events-none absolute left-4 top-4 text-sm text-zinc-400">{placeholder}</p>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={emitChange}
            className="min-h-[150px] w-full resize-y border-0 px-4 py-4 text-sm leading-6 text-zinc-800 outline-none [&_h2]:text-base [&_h2]:font-bold [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-500 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline"
          />
        </div>
      </div>
      <p className="mt-1 px-1 text-right text-xs text-zinc-400">{charCount} / 5000</p>
    </div>
  );
}
