import type { IUserSummary } from "@/domain/meta/IUserSummary";

export interface ISocialDesktopCollapsedProps {
  friends: IUserSummary[];
  isCompact: boolean;
  closeMobile: () => void;
  loading?: boolean;
}
