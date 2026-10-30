import { BlurFade } from "@/components/magicui/blur-fade";
import type { MemoBlock, MemoInline } from "@/data/memos";

type MemoBodyProps = {
  blocks: MemoBlock[];
  /** 첫 블록이 나타나기 시작하는 시각(초). 뒤 블록은 차례로 조금씩 늦게 나타난다. */
  enterDelay?: number;
};

const STAGGER = 0.05;
const MAX_STAGGER_STEPS = 6;

/** 메모 본문. 소제목, 문단, 목록을 순서대로 그린다. */
export function MemoBody({ blocks, enterDelay = 0 }: MemoBodyProps) {
  return (
    <div className="flex flex-col gap-(--space-12)">
      {blocks.map((block, index) => (
        <BlurFade
          key={index}
          direction="up"
          offset={8}
          delay={enterDelay + Math.min(index, MAX_STAGGER_STEPS) * STAGGER}
        >
          <Block block={block} />
        </BlurFade>
      ))}
    </div>
  );
}

// 굵은 글자는 본문(body-md) 크기와 줄 높이를 그대로 두고 굵기와 색만 바뀐다.
function Inlines({ inlines }: { inlines: MemoInline[] }) {
  return inlines.map((inline, i) =>
    inline.bold ? (
      <strong key={i} className="font-bold text-(--text-primary)">
        {inline.text}
      </strong>
    ) : (
      <span key={i}>{inline.text}</span>
    ),
  );
}

function Block({ block }: { block: MemoBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="title-lg text-(--text-primary)">{block.text}</h2>;
    case "subheading":
      return <h3 className="title-md text-(--text-primary)">{block.text}</h3>;
    case "paragraph":
      return (
        <p className="body-md text-(--text-secondary)">
          <Inlines inlines={block.content} />
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-(--space-4)">
          {block.items.map((item, i) => (
            <li key={i} className="body-md flex gap-(--space-8) text-(--text-secondary)">
              <span aria-hidden="true">•</span>
              <span className="min-w-0 flex-1">
                <Inlines inlines={item} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}
