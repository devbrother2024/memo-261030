"use client";

import { useState } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { Card, CardHeader } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { MemoItem } from "@/components/MemoItem";
import { MEMO_CATEGORIES, type Memo, type MemoCategory } from "@/data/memos";
import { formatHomeDate, formatMemoDate } from "@/lib/date";

type Filter = "전체" | MemoCategory;
const FILTERS: Filter[] = ["전체", ...MEMO_CATEGORIES];

type HomeScreenProps = {
  memos: Memo[];
  /** 서버가 요청 시각에 만든 ISO 문자열. 서버와 브라우저가 같은 글자를 그리게 한다. */
  now: string;
};

export function HomeScreen({ memos, now }: HomeScreenProps) {
  const [filter, setFilter] = useState<Filter>("전체");
  const nowDate = new Date(now);

  const visible = memos
    .filter((memo) => filter === "전체" || memo.category === filter)
    // 저장 시각의 표기(+09:00, Z)가 달라서 글자가 아니라 시각 값으로 비교한다.
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const pinned = visible.filter((memo) => memo.pinned);
  const recent = visible.filter((memo) => !memo.pinned);

  const renderItem = (memo: Memo) => (
    <MemoItem
      key={memo.id}
      id={memo.id}
      title={memo.title}
      preview={memo.preview}
      date={formatMemoDate(memo.updatedAt, nowDate)}
      label={memo.label}
    />
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-(--space-16) pt-(--space-64)">
      <div className="flex flex-1 flex-col gap-(--space-16)">
        <header className="flex flex-col gap-(--space-8) px-(--space-8)">
          <p className="caption-md text-(--text-muted)">{formatHomeDate(nowDate)}</p>
          <h1 className="heading-xl text-(--text-primary)">
            <span className="block">오늘까지 메모를</span>
            <span className="block">
              <span className="text-(--color-primary)">{memos.length}개</span> 남겼어요
            </span>
          </h1>
        </header>

        <div role="group" aria-label="분류" className="flex gap-(--space-8) overflow-x-auto px-(--space-4)">
          {FILTERS.map((name) => (
            <Chip
              key={name}
              label={name}
              selected={filter === name}
              onClick={() => setFilter(name)}
            />
          ))}
        </div>

        {pinned.length > 0 && (
          <Card labelledBy="pinned-title">
            <CardHeader id="pinned-title" title="고정한 메모" pin />
            {pinned.map(renderItem)}
          </Card>
        )}

        {recent.length > 0 && (
          <Card labelledBy="recent-title">
            <CardHeader id="recent-title" title="최근 메모" action />
            {recent.map(renderItem)}
          </Card>
        )}

        {visible.length === 0 && (
          <p className="body-sm px-(--space-8) text-(--text-muted)">이 분류에는 아직 메모가 없어요.</p>
        )}
      </div>

      <div className="sticky bottom-0 bg-(--surface-page) pt-(--space-16) pb-(--space-34)">
        <ButtonPrimary href="/memos/new" label="새 메모 쓰기" icon />
      </div>
    </main>
  );
}
