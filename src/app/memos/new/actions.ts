"use server";

import { revalidatePath } from "next/cache";
import { MEMO_CATEGORIES, MEMO_LABELS, type MemoBlock, type MemoCategory, type MemoLabel } from "@/data/memos";
import { previewOf } from "@/lib/memo-body";
import { insertMemo } from "@/lib/memos-db";

export type CreateMemoInput = {
  title: string;
  category: MemoCategory;
  label: MemoLabel;
  body: MemoBlock[];
};

export type CreateMemoResult = { ok: true } | { ok: false; error: string };

const BLOCK_TYPES = new Set(["heading", "subheading", "paragraph", "list"]);

function isBlock(value: unknown): value is MemoBlock {
  return (
    typeof value === "object" &&
    value !== null &&
    BLOCK_TYPES.has((value as { type?: string }).type ?? "")
  );
}

/** 작성 화면에서 저장하면 불린다. 값은 브라우저에서 오므로 서버에서 한 번 더 확인한다. */
export async function createMemo(input: CreateMemoInput): Promise<CreateMemoResult> {
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  if (!MEMO_CATEGORIES.includes(input.category) || !MEMO_LABELS.includes(input.label)) {
    return { ok: false, error: "분류나 색이 올바르지 않아요." };
  }
  if (!Array.isArray(input.body) || !input.body.every(isBlock)) {
    return { ok: false, error: "본문 형식이 올바르지 않아요." };
  }

  try {
    await insertMemo({
      title,
      preview: previewOf(input.body),
      category: input.category,
      label: input.label,
      body: input.body,
    });
  } catch {
    return { ok: false, error: "저장하지 못했어요. 잠시 뒤에 다시 시도해 주세요." };
  }
  revalidatePath("/");
  return { ok: true };
}
