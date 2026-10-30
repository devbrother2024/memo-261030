import { Suspense } from "react";
import { connection } from "next/server";
import { HomeScreen } from "@/components/home/HomeScreen";
import { listMemos } from "@/lib/memos-db";

// 메모는 Supabase에서 요청마다 읽고, 오늘 날짜와 오늘, 어제 같은 글자는 요청 시각이 필요해서 connection() 뒤에서 만든다.
async function Home() {
  await connection();
  const memos = await listMemos();
  return <HomeScreen memos={memos} now={new Date().toISOString()} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}
