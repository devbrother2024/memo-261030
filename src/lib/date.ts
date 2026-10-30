// 서버와 브라우저의 시간대가 달라도 같은 글자가 나오도록 한국 시간으로 고정한다.
const TIME_ZONE = "Asia/Seoul";
const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const homeDateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: TIME_ZONE,
  month: "long",
  day: "numeric",
  weekday: "long",
});

const monthDayFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: TIME_ZONE,
  month: "long",
  day: "numeric",
});

// 환경마다 오전, 오후 글자가 달라서 숫자 부분만 받아 직접 조립한다.
const dateTimeFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: TIME_ZONE,
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hourCycle: "h23",
});

function kstDayNumber(date: Date) {
  return Math.floor((date.getTime() + KST_OFFSET_MS) / DAY_MS);
}

/** 예) 10월 30일 금요일 */
export function formatHomeDate(now: Date) {
  return homeDateFormat.format(now);
}

/** 예) 10월 30일 오전 9:12 */
export function formatMemoDateTime(updatedAt: string) {
  const parts = dateTimeFormat.formatToParts(new Date(updatedAt));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const hour = Number(get("hour"));
  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${get("month")}월 ${get("day")}일 ${period} ${hour12}:${get("minute")}`;
}

/** 오늘, 어제, 그 전에는 10월 28일 */
export function formatMemoDate(updatedAt: string, now: Date) {
  const updated = new Date(updatedAt);
  const diff = kstDayNumber(now) - kstDayNumber(updated);
  // 방금 저장한 메모는 화면의 기준 시각보다 뒤일 수 있어서 0 이하는 모두 오늘이다.
  if (diff <= 0) return "오늘";
  if (diff === 1) return "어제";
  return monthDayFormat.format(updated);
}
