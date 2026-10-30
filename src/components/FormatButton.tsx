type FormatButtonProps = {
  label: string;
  /** 스크린 리더가 읽는 이름. 없으면 label을 읽는다. */
  name?: string;
  /** 커서가 있는 글자에 이 서식이 걸려 있으면 켠다. */
  active?: boolean;
  onClick: () => void;
};

/** 서식 버튼. 글자를 고르고 누르면 굵게, 제목, 소제목, 목록이 된다. */
export function FormatButton({ label, name, active = false, onClick }: FormatButtonProps) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={active}
      // 버튼을 눌러도 편집기에서 고른 글자와 커서가 풀리지 않게 한다.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`label-md flex h-9 items-center justify-center rounded-sm px-(--space-12) whitespace-nowrap ${
        active ? "bg-(--label-blue-soft) text-(--color-primary)" : "text-(--text-secondary)"
      }`}
    >
      {label}
    </button>
  );
}
