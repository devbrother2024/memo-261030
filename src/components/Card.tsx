import Link from "next/link";
import { Icon } from "@/components/Icon";

/** 카드 겉틀. 흰 배경, 모서리 24, 위아래 여백 8. 안쪽에 CardHeader와 MemoItem을 넣는다. */
export function Card({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className="flex w-full flex-col overflow-hidden rounded-xl bg-(--surface-card) py-(--space-8)"
    >
      {children}
    </section>
  );
}

type CardHeaderProps = {
  id: string;
  title: string;
  /** 켜면 제목 앞에 고정한 메모 표시가 붙는다. */
  pin?: boolean;
  /** 켜면 오른쪽에 전체 보기가 붙는다. */
  action?: boolean;
};

export function CardHeader({ id, title, pin = false, action = false }: CardHeaderProps) {
  return (
    <div className="flex h-10 items-center gap-(--space-4) pt-(--space-12) pr-(--space-16) pb-(--space-4) pl-(--space-20)">
      {pin && <Icon name="pin" className="text-(--color-primary)" />}
      <h2 id={id} className="label-md min-w-0 flex-1 text-(--text-primary)">
        {title}
      </h2>
      {action && (
        <Link
          href="/memos"
          className="caption-md flex shrink-0 items-center gap-(--space-4) whitespace-nowrap text-(--text-muted)"
        >
          전체 보기
          <Icon name="chevron-right" />
        </Link>
      )}
    </div>
  );
}
