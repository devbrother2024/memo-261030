"use client";

import { useState } from "react";
import { IconButton } from "@/components/IconButton";
import { WriteForm } from "@/components/write/WriteForm";
import { useStoredDraft } from "@/lib/memo-storage";

/** 저장해 둔 초안이 있으면 불러온 뒤에 폼을 그린다. 불러오는 동안은 뒤로가기만 있는 뼈대를 보인다. */
export function WriteScreen() {
  const draft = useStoredDraft();
  // 저장이 끝나면 key를 바꿔 폼을 새로 만든다. Next가 떠난 화면의 상태를 숨겨서 보존하기 때문에
  // 이렇게 하지 않으면 "새 메모 쓰기"를 다시 눌렀을 때 방금 저장한 내용이 그대로 남아 있다.
  const [formKey, setFormKey] = useState(0);

  if (draft === undefined) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-(--space-16) pt-(--space-48)">
        <nav aria-label="메모 작성 도구" className="flex items-center justify-between">
          <IconButton icon="chevron-left" label="뒤로가기" href="/" />
        </nav>
      </main>
    );
  }

  return (
    <WriteForm key={formKey} initialDraft={draft} onSaved={() => setFormKey((value) => value + 1)} />
  );
}
