import type { Memo, MemoBlock, MemoCategory, MemoLabel } from "@/data/memos";
import { createSupabase } from "@/lib/supabase";

// public.memos 표의 한 줄. body는 jsonb라서 저장해 둔 블록 배열 그대로 온다.
type MemoRow = {
  id: string;
  title: string;
  preview: string;
  category: string;
  label: string;
  pinned: boolean;
  body: unknown;
  updated_at: string;
};

function toMemo(row: MemoRow): Memo {
  return {
    id: row.id,
    title: row.title,
    preview: row.preview,
    category: row.category as MemoCategory,
    label: row.label as MemoLabel,
    pinned: row.pinned,
    updatedAt: row.updated_at,
    body: Array.isArray(row.body) ? (row.body as MemoBlock[]) : [],
  };
}

/** 모든 메모를 최근에 고친 순서로 읽는다. */
export async function listMemos(): Promise<Memo[]> {
  const { data, error } = await createSupabase()
    .from("memos")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`메모 목록을 읽지 못했어요: ${error.message}`);
  return (data as MemoRow[]).map(toMemo);
}

/** 메모 한 건. 없으면 null. */
export async function getMemo(id: string): Promise<Memo | null> {
  const { data, error } = await createSupabase().from("memos").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`메모를 읽지 못했어요: ${error.message}`);
  return data ? toMemo(data as MemoRow) : null;
}

export type NewMemo = {
  title: string;
  preview: string;
  category: MemoCategory;
  label: MemoLabel;
  body: MemoBlock[];
};

export async function insertMemo(memo: NewMemo) {
  const { error } = await createSupabase().from("memos").insert(memo);
  if (error) throw new Error(`메모를 저장하지 못했어요: ${error.message}`);
}
