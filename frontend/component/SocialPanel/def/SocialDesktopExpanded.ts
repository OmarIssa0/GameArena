import type { IUserSummary } from "@/domain/meta/IUserSummary";

export interface ISocialDesktopExpandedProps {
  friends: IUserSummary[];
  loading: boolean;
  gameInvites: { roomId: string }[];
  isCompact: boolean;
  closeMobile: () => void;
}
