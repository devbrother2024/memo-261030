type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

/** 분류 칩. 누르면 그 분류의 메모만 보인다. 고른 칩은 selected. */
export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`label-md flex h-9 shrink-0 items-center rounded-full px-(--space-16) whitespace-nowrap ${
        selected
          ? "bg-primary text-(--text-on-primary)"
          : "bg-(--surface-card) text-(--text-secondary)"
      }`}
    >
      {label}
    </button>
  );
}
