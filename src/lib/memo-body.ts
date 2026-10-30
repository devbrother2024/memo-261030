import type { MemoBlock, MemoInline } from "@/data/memos";

// ---------- 저장 데이터(MemoBlock) -> 편집기 HTML ----------

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlinesToHtml(inlines: MemoInline[]) {
  return inlines
    .map((inline) =>
      inline.bold ? `<b>${escapeHtml(inline.text)}</b>` : escapeHtml(inline.text),
    )
    .join("");
}

/** 저장된 본문을 편집기에 넣을 HTML로 바꾼다. 글자는 모두 이스케이프한다. */
export function blocksToHtml(blocks: MemoBlock[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${escapeHtml(block.text)}</h2>`;
        case "subheading":
          return `<h3>${escapeHtml(block.text)}</h3>`;
        case "paragraph":
          return `<p>${inlinesToHtml(block.content)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${inlinesToHtml(item)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}

// ---------- 편집기 DOM -> 저장 데이터(MemoBlock) ----------

const BLOCK_TAGS = new Set(["DIV", "P", "UL", "OL", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE"]);

function isBoldElement(el: HTMLElement) {
  if (el.tagName === "B" || el.tagName === "STRONG") return true;
  const weight = el.style.fontWeight;
  return weight === "bold" || Number(weight) >= 600;
}

function pushInline(out: MemoInline[], text: string, bold: boolean) {
  if (!text) return;
  const last = out[out.length - 1];
  if (last && Boolean(last.bold) === bold) last.text += text;
  else out.push(bold ? { text, bold: true } : { text });
}

function collectNode(node: Node, bold: boolean, out: MemoInline[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    pushInline(out, (node.textContent ?? "").replace(/[\s ]+/g, " "), bold);
    return;
  }
  if (!(node instanceof HTMLElement)) return;
  if (node.tagName === "BR") {
    pushInline(out, " ", bold);
    return;
  }
  const nextBold = bold || isBoldElement(node);
  node.childNodes.forEach((child) => collectNode(child, nextBold, out));
}

function trimInlines(inlines: MemoInline[]) {
  const result = inlines.map((inline) => ({ ...inline }));
  if (result.length > 0) result[0].text = result[0].text.trimStart();
  if (result.length > 0) result[result.length - 1].text = result[result.length - 1].text.trimEnd();
  return result.filter((inline) => inline.text.length > 0);
}

const plainText = (inlines: MemoInline[]) => inlines.map((inline) => inline.text).join("");

function inlinesOf(nodes: Node[]) {
  const out: MemoInline[] = [];
  nodes.forEach((node) => collectNode(node, false, out));
  return trimInlines(out);
}

function walk(parent: Node, blocks: MemoBlock[]) {
  let loose: Node[] = [];
  const flush = () => {
    const content = inlinesOf(loose);
    if (content.length > 0) blocks.push({ type: "paragraph", content });
    loose = [];
  };

  parent.childNodes.forEach((child) => {
    if (!(child instanceof HTMLElement) || !BLOCK_TAGS.has(child.tagName)) {
      loose.push(child);
      return;
    }
    flush();
    const tag = child.tagName;
    if (tag === "H1" || tag === "H2") {
      const text = plainText(inlinesOf([...child.childNodes]));
      if (text) blocks.push({ type: "heading", text });
    } else if (/^H[3-6]$/.test(tag)) {
      const text = plainText(inlinesOf([...child.childNodes]));
      if (text) blocks.push({ type: "subheading", text });
    } else if (tag === "UL" || tag === "OL") {
      const items = [...child.children]
        .filter((li) => li.tagName === "LI")
        .map((li) => inlinesOf([...li.childNodes]))
        .filter((item) => item.length > 0);
      if (items.length > 0) blocks.push({ type: "list", items });
    } else if ([...child.children].some((c) => BLOCK_TAGS.has(c.tagName))) {
      walk(child, blocks);
    } else {
      const content = inlinesOf([...child.childNodes]);
      if (content.length > 0) blocks.push({ type: "paragraph", content });
    }
  });
  flush();
}

/** 편집기 안의 내용을 저장할 수 있는 본문 블록으로 바꾼다. 빈 줄은 버린다. */
export function editorToBlocks(root: HTMLElement): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  walk(root, blocks);
  return blocks;
}

/** 홈 목록의 미리보기 글. 본문 첫 줄을 80자까지 쓴다. */
export function previewOf(blocks: MemoBlock[]) {
  const first = blocks[0];
  if (!first) return "";
  let text = "";
  if (first.type === "heading" || first.type === "subheading") text = first.text;
  else if (first.type === "paragraph") text = plainText(first.content);
  else text = plainText(first.items[0] ?? []);
  return text.slice(0, 80);
}
