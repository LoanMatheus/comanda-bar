import type { IconType } from "react-icons";

export type ActionIconValue = IconType | string;

export function ActionIcon({ icon }: { icon: ActionIconValue }) {
  if (typeof icon === "string") {
    return <span className="action-icon-text">{icon}</span>;
  }
  const Icon = icon;
  return <Icon aria-hidden="true" />;
}
