"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { Chip } from "@/components/Chip";
import { IconButton } from "@/components/IconButton";
import { InputField } from "@/components/InputField";
import { LabelDot } from "@/components/LabelDot";
import { RichEditor } from "@/components/write/RichEditor";
import { createMemo } from "@/app/memos/new/actions";
import { MEMO_CATEGORIES, MEMO_LABELS, type MemoBlock, type MemoCategory, type MemoLabel } from "@/data/memos";
import { clearDraft, saveDraft, type Draft } from "@/lib/memo-storage";

const AUTOSAVE_DELAY_MS = 500;

type WriteFormProps = {
  initialDraft: Draft | null;
  /** 메모를 저장한 직후에 불린다. 부모가 폼을 비우는 데 쓴다. */
  onSaved: () => void;
};

export function WriteForm({ initialDraft, onSaved }: WriteFormProps) {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<MemoBlock[]>(initialDraft?.body ?? []);

  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [category, setCategory] = useState<MemoCategory>(initialDraft?.category ?? "업무");
  const [label, setLabel] = useState<MemoLabel>(initialDraft?.label ?? "blue");
  const [autosaved, setAutosaved] = useState(initialDraft !== null);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  // 사용자가 무언가 바꿀 때마다 호출한다. 바꾼 뒤 잠깐 멈추면 초안을 자동 저장한다.
  const touch = () => {
    setAutosaved(false);
    setError(null);
    setRevision((value) => value + 1);
  };

  const handleBodyChange = useCallback((blocks: MemoBlock[]) => {
    bodyRef.current = blocks;
    setAutosaved(false);
    setError(null);
    setRevision((value) => value + 1);
  }, []);

  useEffect(() => {
    if (revision === 0) return;
    const timer = window.setTimeout(() => {
      if (saveDraft({ title, category, label, body: bodyRef.current })) setAutosaved(true);
    }, AUTOSAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [revision, title, category, label]);

  const handleSave = () => {
    if (saving) return;
    const trimmed = title.trim();
    if (!trimmed) {
      setError("제목을 입력해 주세요.");
      titleRef.current?.focus();
      return;
    }
    startSaving(async () => {
      try {
        const result = await createMemo({ title: trimmed, category, label, body: bodyRef.current });
        if (!result.ok) {
          setError(result.error);
          return;
        }
      } catch {
        setError("저장하지 못했어요. 네트워크를 확인하고 다시 시도해 주세요.");
        return;
      }
      clearDraft();
      onSaved();
      router.push("/");
    });
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-(--space-16) pt-(--space-48)">
      <div className="flex flex-1 flex-col gap-(--space-16)">
        <nav aria-label="메모 작성 도구" className="flex items-center justify-between">
          <IconButton icon="chevron-left" label="뒤로가기" href="/" />
          {autosaved && (
            <p role="status" className="caption-sm text-(--text-muted)">
              자동 저장됨
            </p>
          )}
        </nav>

        <div className="flex flex-col gap-(--space-12)">
          <InputField
            label="제목"
            value={title}
            placeholder="제목을 입력하세요"
            inputRef={titleRef}
            invalid={error !== null && title.trim() === ""}
            onChange={(value) => {
              setTitle(value);
              touch();
            }}
          />

          <div className="flex flex-col gap-(--space-12) px-(--space-8) py-(--space-4)">
            <div className="flex items-center gap-(--space-8)">
              <span className="caption-sm text-(--text-muted)">분류</span>
              {MEMO_CATEGORIES.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  selected={category === name}
                  onClick={() => {
                    setCategory(name);
                    touch();
                  }}
                />
              ))}
            </div>
            <div role="radiogroup" aria-label="색" className="flex items-center gap-(--space-8)">
              <span aria-hidden="true" className="caption-sm text-(--text-muted)">
                색
              </span>
              {MEMO_LABELS.map((color) => (
                <LabelDot
                  key={color}
                  color={color}
                  selected={label === color}
                  onClick={() => {
                    setLabel(color);
                    touch();
                  }}
                />
              ))}
            </div>
          </div>

          <RichEditor initialBlocks={initialDraft?.body ?? []} onChange={handleBodyChange} />

          {error && (
            <p role="alert" className="body-sm px-(--space-8) text-(--text-secondary)">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-(--surface-page) pt-(--space-16) pb-(--space-34)">
        <ButtonPrimary label={saving ? "저장하는 중" : "저장하기"} onClick={handleSave} />
      </div>
    </main>
  );
}
