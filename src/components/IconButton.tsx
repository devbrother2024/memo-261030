import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";

type IconButtonProps = {
  icon: IconName;
  /** 스크린 리더가 읽는 이름. 아이콘만 있어서 꼭 필요하다. */
  label: string;
  /** 주면 링크로, 안 주면 버튼으로 그린다. */
  href?: string;
};

const CLASS_NAME =
  "flex size-10 shrink-0 items-center justify-center rounded-sm text-(--text-primary)";

/** 아이콘 버튼. 40x40 누르는 영역 가운데에 아이콘을 둔다. */
export function IconButton({ icon, label, href }: IconButtonProps) {
  if (href) {
    return (
      <Link href={href} aria-label={label} className={CLASS_NAME}>
        <Icon name={icon} />
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} className={CLASS_NAME}>
      <Icon name={icon} />
    </button>
  );
}
