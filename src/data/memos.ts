export type MemoCategory = "업무" | "개인" | "아이디어";
export type MemoLabel = "blue" | "green" | "orange" | "pink";

/** 문단 안에서 일부 글자만 굵게 보일 때 쓴다. */
export type MemoInline = { text: string; bold?: boolean };

export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; content: MemoInline[] }
  | { type: "list"; items: MemoInline[][] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  category: MemoCategory;
  label: MemoLabel;
  pinned: boolean;
  updatedAt: string;
  body: MemoBlock[];
};

export const MEMO_CATEGORIES: MemoCategory[] = ["업무", "개인", "아이디어"];
export const MEMO_LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];
