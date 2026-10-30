import type { MemoLabel } from "@/data/memos";

// 메모의 색 라벨. 배경(soft)과 글자, 아이콘 색(strong)이 한 쌍이다.
// dot은 색 라벨을 고르는 동그라미처럼 진한 색을 배경으로 칠할 때 쓴다.
export const LABEL_STYLE: Record<MemoLabel, { soft: string; strong: string; dot: string }> = {
  blue: { soft: "bg-(--label-blue-soft)", strong: "text-(--label-blue)", dot: "bg-(--label-blue)" },
  green: { soft: "bg-(--label-green-soft)", strong: "text-(--label-green)", dot: "bg-(--label-green)" },
  orange: { soft: "bg-(--label-orange-soft)", strong: "text-(--label-orange)", dot: "bg-(--label-orange)" },
  pink: { soft: "bg-(--label-pink-soft)", strong: "text-(--label-pink)", dot: "bg-(--label-pink)" },
};
