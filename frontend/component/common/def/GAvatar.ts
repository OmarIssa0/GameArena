import type { TNullable } from "@/domain/type/TCommon";
import type { GGradient, GSize } from "../tokens";

export interface GAvatarProps {
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  userName: TNullable<string>;
  src?: TNullable<string>;
  size?: GSize;
  shape?: "rounded" | "circle";
  gradient?: GGradient;
  className?: string;
}
