"use client";

import { MotionConfig } from "motion/react";

/** 사용자가 시스템에서 "동작 줄이기"를 켰으면 움직임(위치 이동)을 끄고 나타나는 것만 남긴다. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
