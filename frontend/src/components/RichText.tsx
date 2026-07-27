import { isHtmlContent, sanitizeHtml } from "@/lib/sanitizeHtml";

const richTextTagStyles =
  "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-500 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline";

export function RichText({ value, className = "" }: { value: string; className?: string }) {
  if (isHtmlContent(value)) {
    return <div className={`${className} ${richTextTagStyles}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />;
  }
  return <p className={`whitespace-pre-wrap ${className}`}>{value}</p>;
}
