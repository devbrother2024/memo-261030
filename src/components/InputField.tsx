import type { Ref } from "react";

type InputFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
  invalid?: boolean;
};

/** 제목 입력 칸. 입력 중에는 파란 테두리를 보이고, 비어 있으면 회색 안내 문구를 보인다. */
export function InputField({ label, value, placeholder, onChange, inputRef, invalid = false }: InputFieldProps) {
  return (
    <label className="flex flex-col gap-(--space-4) rounded-lg bg-(--surface-card) px-(--space-20) py-(--space-16) focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(color:--color-primary)">
      <span className="caption-sm text-(--text-muted)">{label}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
        className="title-md h-6 w-full bg-transparent text-(--text-primary) outline-none placeholder:text-(--text-muted)"
      />
    </label>
  );
}
