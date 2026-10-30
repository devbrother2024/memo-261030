"use client";

import { useSyncExternalStore } from "react";
import type { MemoBlock, MemoCategory, MemoLabel } from "@/data/memos";

// 아직 저장하지 않은 작성 중 초안만 이 브라우저(localStorage)에 둔다. 저장한 메모는 Supabase에 있다.
const DRAFT_KEY = "memo:draft:v1";

export type Draft = {
  title: string;
  category: MemoCategory;
  label: MemoLabel;
  body: MemoBlock[];
};

const CATEGORIES: MemoCategory[] = ["업무", "개인", "아이디어"];
const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

function isDraft(value: unknown): value is Draft {
  if (typeof value !== "object" || value === null) return false;
  const d = value as Record<string, unknown>;
  return (
    typeof d.title === "string" &&
    CATEGORIES.includes(d.category as MemoCategory) &&
    LABELS.includes(d.label as MemoLabel) &&
    Array.isArray(d.body)
  );
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

let draftCache: { raw: string | null; value: Draft | null } = { raw: null, value: null };

function readDraft(): Draft | null {
  const raw = readRaw(DRAFT_KEY);
  if (raw === draftCache.raw) return draftCache.value;
  let value: Draft | null = null;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    value = isDraft(parsed) ? parsed : null;
  } catch {
    value = null;
  }
  draftCache = { raw, value };
  return value;
}

const neverSubscribe = () => () => {};

/** 작성 중이던 초안. 화면이 열릴 때 한 번 읽는 용도이고, 서버와 첫 화면에서는 undefined(아직 모름)이다. */
export function useStoredDraft(): Draft | null | undefined {
  return useSyncExternalStore(neverSubscribe, readDraft, () => undefined);
}

export function saveDraft(draft: Draft): boolean {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // 저장 공간을 쓸 수 없으면 지울 것도 없다.
  }
}
