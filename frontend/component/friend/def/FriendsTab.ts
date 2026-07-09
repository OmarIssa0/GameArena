interface FriendsTabProps {
  onMessage: (friendId: string) => void;
  onInvite: (friendId: string) => void;
  onNavigateToSearch: () => void;
}

export type { FriendsTabProps };
