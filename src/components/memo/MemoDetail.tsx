import { Badge } from "@/components/Badge";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { IconButton } from "@/components/IconButton";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MemoBody } from "@/components/MemoBody";
import { MotionRoot } from "@/components/MotionRoot";
import type { Memo } from "@/data/memos";
import { formatMemoDateTime } from "@/lib/date";

/** 메모를 찾는 동안 먼저 보이는 뼈대. 뒤로가기는 바로 누를 수 있다. */
export function MemoDetailSkeleton() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-(--space-16) pt-(--space-48)">
      <div className="flex flex-1 flex-col gap-(--space-16)">
        <nav aria-label="메모 도구" className="flex items-center justify-between">
          <IconButton icon="chevron-left" label="뒤로가기" href="/" />
        </nav>
        <div className="flex-1 rounded-xl bg-(--surface-card)" />
      </div>
      <div className="pt-(--space-16) pb-(--space-34)">
        <div className="h-14" />
      </div>
    </main>
  );
}

// 홈에서 넘어오면 카드 껍데기와 뒤로가기는 그대로 있고, 안쪽 내용이 위에서 아래로 차례로 선명해진다.
// 각 값은 나타나기 시작하는 시각(초)이다.
const ENTER = {
  actions: 0,
  meta: 0.04,
  title: 0.08,
  divider: 0.12,
  body: 0.16,
  button: 0.24,
};

export function MemoDetail({ memo }: { memo: Memo }) {
  return (
    <MotionRoot>
      <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-(--space-16) pt-(--space-48)">
        <div className="flex flex-1 flex-col gap-(--space-16)">
          <nav aria-label="메모 도구" className="flex items-center justify-between">
            <IconButton icon="chevron-left" label="뒤로가기" href="/" />
            <BlurFade className="flex" direction="up" offset={8} delay={ENTER.actions}>
              <IconButton icon="pin-24" label="고정" />
              <IconButton icon="share" label="공유" />
              <IconButton icon="more" label="더보기" />
            </BlurFade>
          </nav>

          <article className="flex flex-1 flex-col gap-(--space-12) rounded-xl bg-(--surface-card) px-(--space-20) py-(--space-24)">
            <BlurFade className="flex items-center gap-(--space-8)" direction="up" offset={8} delay={ENTER.meta}>
              <Badge label={memo.category} color={memo.label} />
              <time dateTime={memo.updatedAt} className="caption-sm whitespace-nowrap text-(--text-muted)">
                {formatMemoDateTime(memo.updatedAt)}
              </time>
            </BlurFade>
            <BlurFade direction="up" offset={8} delay={ENTER.title}>
              <h1 className="heading-lg text-(--text-primary)">{memo.title}</h1>
            </BlurFade>
            <BlurFade direction="up" offset={8} delay={ENTER.divider}>
              <hr className="h-px border-0 bg-(--border-default)" />
            </BlurFade>
            <MemoBody blocks={memo.body} enterDelay={ENTER.body} />
          </article>
        </div>

        <div className="sticky bottom-0 bg-(--surface-page) pt-(--space-16) pb-(--space-34)">
          <BlurFade direction="up" offset={8} delay={ENTER.button}>
            <ButtonPrimary href={`/memos/${memo.id}/edit`} label="수정하기" />
          </BlurFade>
        </div>
      </main>
    </MotionRoot>
  );
}
