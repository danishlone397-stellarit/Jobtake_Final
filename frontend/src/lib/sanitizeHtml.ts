export function isHtmlContent(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

const ALLOWED_TAGS = new Set([
  "P", "DIV", "BR", "B", "STRONG", "I", "EM", "U", "UL", "OL", "LI",
  "A", "H1", "H2", "H3", "BLOCKQUOTE", "SPAN",
]);

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/ on\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/ on\w+\s*=\s*'[^']*'/gi, "")
      .replace(/javascript:/gi, "");
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  function clean(node: Element) {
    [...node.children].forEach(child => {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        return;
      }
      [...child.attributes].forEach(attr => {
        const isSafeHref = child.tagName === "A" && attr.name === "href" && !/^javascript:/i.test(attr.value);
        if (!(attr.name === "href" && isSafeHref)) child.removeAttribute(attr.name);
      });
      clean(child);
    });
  }
  clean(doc.body);

  return doc.body.innerHTML;
}
