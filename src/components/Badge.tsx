import { LABEL_STYLE } from "@/components/label-style";
import type { MemoLabel } from "@/data/memos";

/** 메모의 분류 배지. 색은 메모의 색 라벨을 따른다. */
export function Badge({ label, color }: { label: string; color: MemoLabel }) {
  const style = LABEL_STYLE[color];
  return (
    <span
      className={`caption-sm flex h-[26px] items-center rounded-full px-(--space-8) whitespace-nowrap ${style.soft} ${style.strong}`}
    >
      {label}
    </span>
  );
}
