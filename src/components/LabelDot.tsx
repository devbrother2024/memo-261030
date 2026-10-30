import { LABEL_STYLE } from "@/components/label-style";
import type { MemoLabel } from "@/data/memos";

export const LABEL_NAME: Record<MemoLabel, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
};

type LabelDotProps = {
  color: MemoLabel;
  selected?: boolean;
  onClick: () => void;
};

/** 색 라벨 고르기. 고른 색은 바깥에 파란 테두리(2px)가 생긴다. */
export function LabelDot({ color, selected = false, onClick }: LabelDotProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={LABEL_NAME[color]}
      onClick={onClick}
      className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-(--color-primary)" : "border-transparent"
      }`}
    >
      <span className={`size-[22px] rounded-full ${LABEL_STYLE[color].dot}`} />
    </button>
  );
}
