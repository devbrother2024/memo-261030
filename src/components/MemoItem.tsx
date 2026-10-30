import Link from "next/link";
import { Icon } from "@/components/Icon";
import { LABEL_STYLE } from "@/components/label-style";
import type { MemoLabel } from "@/data/memos";

type MemoItemProps = {
  id: string;
  title: string;
  preview: string;
  date: string;
  label: MemoLabel;
};

/** 메모 목록의 한 줄. 미리보기는 1줄까지 보이고 넘치면 말줄임. 누르면 메모 상세로 이동한다. */
export function MemoItem({ id, title, preview, date, label }: MemoItemProps) {
  const color = LABEL_STYLE[label];
  return (
    <Link
      href={`/memos/${id}`}
      className="flex h-18 items-center gap-(--space-16) px-(--space-20) py-(--space-12)"
    >
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-sm ${color.soft}`}>
        <Icon name="note" className={color.strong} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-(--space-4)">
        <span className="title-md text-(--text-primary)">{title}</span>
        <span className="body-sm truncate text-(--text-secondary)">{preview}</span>
      </span>
      <span className="caption-sm shrink-0 whitespace-nowrap text-(--text-muted)">{date}</span>
    </Link>
  );
}
