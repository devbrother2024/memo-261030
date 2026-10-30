import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MemoDetail, MemoDetailSkeleton } from "@/components/memo/MemoDetail";
import { getMemo } from "@/lib/memos-db";

type Params = PageProps<"/memos/[id]">["params"];

export async function generateMetadata({ params }: PageProps<"/memos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const memo = await getMemo(id);
  return { title: memo ? `${memo.title} | 메모` : "메모" };
}

// params와 메모 내용은 요청마다 달라서 Suspense 안에서 읽는다. 홈에서 눌렀을 때 뼈대가 바로 보인다.
async function Content({ params }: { params: Params }) {
  const { id } = await params;
  const memo = await getMemo(id);
  if (!memo) notFound();
  return <MemoDetail memo={memo} />;
}

export default function Page(props: PageProps<"/memos/[id]">) {
  return (
    <Suspense fallback={<MemoDetailSkeleton />}>
      <Content params={props.params} />
    </Suspense>
  );
}
