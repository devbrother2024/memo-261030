import type { Metadata } from "next";
import { WriteScreen } from "@/components/write/WriteScreen";

export const metadata: Metadata = { title: "새 메모 | 메모" };

export default function Page() {
  return <WriteScreen />;
}
