import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { GSize } from "../tokens";

interface GTileProps {
  user: IUserSummary;
  size?: GSize;
}

export type { GTileProps };
