"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormatButton } from "@/components/FormatButton";
import type { MemoBlock } from "@/data/memos";
import { blocksToHtml, editorToBlocks } from "@/lib/memo-body";

type Active = { bold: boolean; heading: boolean; subheading: boolean; list: boolean };
const NONE: Active = { bold: false, heading: false, subheading: false, list: false };

type RichEditorProps = {
  initialBlocks: MemoBlock[];
  /** 내용이나 서식이 바뀔 때마다 저장할 수 있는 형태로 불린다. */
  onChange: (blocks: MemoBlock[]) => void;
};

/**
 * 본문 편집기. 굵게, 제목, 소제목, 목록 서식을 쓴다.
 * 브라우저의 contenteditable과 execCommand를 쓴다. execCommand는 오래된 API지만 모든 브라우저가 지원한다.
 */
export function RichEditor({ initialBlocks, onChange }: RichEditorProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [initialHtml] = useState(() => blocksToHtml(initialBlocks));
  const [empty, setEmpty] = useState(initialBlocks.length === 0);
  const [active, setActive] = useState<Active>(NONE);

  const emit = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const blocks = editorToBlocks(el);
    setEmpty(blocks.length === 0);
    onChange(blocks);
  }, [onChange]);

  // 커서가 있는 글자의 서식을 서식 버튼에 보여 준다.
  useEffect(() => {
    const update = () => {
      const el = bodyRef.current;
      const anchor = document.getSelection()?.anchorNode;
      if (!el || !anchor || !el.contains(anchor)) {
        setActive(NONE);
        return;
      }
      const block = String(document.queryCommandValue("formatBlock")).toLowerCase().replace(/[<>]/g, "");
      const heading = block === "h1" || block === "h2";
      const subheading = block === "h3";
      setActive({
        // 제목과 소제목은 글자가 원래 굵어서 굵게 버튼은 켜지 않는다.
        bold: document.queryCommandState("bold") && !heading && !subheading,
        heading,
        subheading,
        list: document.queryCommandState("insertUnorderedList"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const exec = (command: string, value?: string) => {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
    emit();
  };

  const toggleBlock = (tag: "h2" | "h3") => {
    const current = String(document.queryCommandValue("formatBlock")).toLowerCase().replace(/[<>]/g, "");
    exec("formatBlock", current === tag ? "<p>" : `<${tag}>`);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border-2 border-transparent bg-(--surface-card) focus-within:border-(--color-primary)">
      <div role="toolbar" aria-label="본문 서식" className="flex h-13 items-center gap-(--space-4) px-(--space-12)">
        <FormatButton label="B" name="굵게" active={active.bold} onClick={() => exec("bold")} />
        <FormatButton label="제목" active={active.heading} onClick={() => toggleBlock("h2")} />
        <FormatButton label="소제목" active={active.subheading} onClick={() => toggleBlock("h3")} />
        <FormatButton label="목록" active={active.list} onClick={() => exec("insertUnorderedList")} />
      </div>
      <hr className="h-px border-0 bg-(--border-default)" />
      <div className="relative">
        {empty && (
          <span
            aria-hidden="true"
            className="body-md pointer-events-none absolute top-(--space-16) left-(--space-20) text-(--text-muted)"
          >
            내용을 입력하세요
          </span>
        )}
        <div
          ref={bodyRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="본문"
          spellCheck={false}
          className="memo-editor min-h-40 px-(--space-20) py-(--space-16)"
          dangerouslySetInnerHTML={{ __html: initialHtml }}
          onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
          onInput={emit}
          onPaste={(event) => {
            // 다른 곳에서 복사한 서식이 섞이지 않게 글자만 붙인다.
            event.preventDefault();
            document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
          }}
        />
      </div>
    </div>
  );
}
