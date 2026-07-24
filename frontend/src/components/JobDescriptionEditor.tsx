"use client";

import { useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function replaceSelection(nextText: string, nextStart: number, nextEnd: number) {
    onChange(nextText);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextStart, nextEnd);
    });
  }

  function wrapSelection(prefix: string, suffix = prefix, fallback = "text") {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || fallback;
    const next = `${value.slice(0, selectionStart)}${prefix}${selected}${suffix}${value.slice(selectionEnd)}`;
    replaceSelection(next, selectionStart + prefix.length, selectionStart + prefix.length + selected.length);
  }

  function prefixLines(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || "List item";
    const formatted = selected
      .split("\n")
      .map((line, index) => `${prefix === "1. " ? `${index + 1}. ` : prefix}${line}`)
      .join("\n");
    const next = `${value.slice(0, selectionStart)}${formatted}${value.slice(selectionEnd)}`;
    replaceSelection(next, selectionStart, selectionStart + formatted.length);
  }

  function applyBlockFormat(format: string) {
    if (format === "heading") prefixLines("## ");
    if (format === "quote") prefixLines("> ");
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
            value="paragraph"
            onChange={(event) => applyBlockFormat(event.target.value)}
          >
            <option value="paragraph">Paragraph</option>
            <option value="heading">Heading</option>
            <option value="quote">Quote</option>
          </select>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button type="button" className={buttonClass} title="Bold" aria-label="Bold" onClick={() => wrapSelection("**")}>
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Italic" aria-label="Italic" onClick={() => wrapSelection("*")}>
            <Italic className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Underline" aria-label="Underline" onClick={() => wrapSelection("__")}>
            <Underline className="h-4 w-4" />
          </button>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button type="button" className={buttonClass} title="Bullet list" aria-label="Bullet list" onClick={() => prefixLines("- ")}>
            <List className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Numbered list" aria-label="Numbered list" onClick={() => prefixLines("1. ")}>
            <ListOrdered className="h-4 w-4" />
          </button>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button type="button" className={buttonClass} title="Align left" aria-label="Align left" onClick={() => textareaRef.current?.focus()}>
            <AlignLeft className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Align center" aria-label="Align center" onClick={() => textareaRef.current?.focus()}>
            <AlignCenter className="h-4 w-4" />
          </button>
          <button type="button" className={buttonClass} title="Align right" aria-label="Align right" onClick={() => textareaRef.current?.focus()}>
            <AlignRight className="h-4 w-4" />
          </button>

          <span className="mx-1 h-6 w-px bg-zinc-200" />

          <button
            type="button"
            className={buttonClass}
            title="Insert link"
            aria-label="Insert link"
            onClick={() => wrapSelection("[", "](https://)", "link text")}
          >
            <Link className="h-4 w-4" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          className="min-h-[150px] w-full resize-y border-0 px-4 py-4 text-sm leading-6 text-zinc-800 outline-none placeholder:text-zinc-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={6}
        />
      </div>
    </div>
  );
}
