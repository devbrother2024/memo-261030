export type IconName =
  | "plus"
  | "note"
  | "pin"
  | "pin-24"
  | "chevron-right"
  | "chevron-left"
  | "share"
  | "more";

// public/icons의 SVG 원본 크기. 파일의 width, height와 같다.
const SIZE_CLASS: Record<IconName, string> = {
  plus: "size-5",
  note: "size-[22px]",
  pin: "size-4",
  "pin-24": "size-6",
  "chevron-right": "size-4",
  "chevron-left": "size-6",
  share: "size-6",
  more: "size-6",
};

/**
 * 아이콘 색은 글자색(currentColor)을 따른다. 색은 쓰는 곳에서 text-(--토큰이름)으로 준다.
 */
export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const url = `url(/icons/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${SIZE_CLASS[name]} ${className}`}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
