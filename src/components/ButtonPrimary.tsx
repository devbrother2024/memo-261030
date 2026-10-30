import Link from "next/link";
import { Icon } from "@/components/Icon";

type ButtonPrimaryProps = {
  label: string;
  /** 켜면 글자 앞에 + 아이콘이 붙는다. */
  icon?: boolean;
} & (
  | { href: string; onClick?: never }
  | { onClick: () => void; href?: never }
);

const CLASS_NAME =
  "button-md flex h-14 w-full items-center justify-center gap-(--space-8) rounded-md bg-primary px-(--space-24) text-(--text-on-primary)";

/** 화면의 주 버튼. 화면마다 하나만 두고 아래쪽에 가로로 꽉 차게 둔다. href를 주면 이동하고, onClick을 주면 그 동작을 한다. */
export function ButtonPrimary({ label, icon = false, href, onClick }: ButtonPrimaryProps) {
  const content = (
    <>
      {icon && <Icon name="plus" />}
      {label}
    </>
  );
  if (href !== undefined) {
    return (
      <Link href={href} className={CLASS_NAME}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={CLASS_NAME}>
      {content}
    </button>
  );
}
