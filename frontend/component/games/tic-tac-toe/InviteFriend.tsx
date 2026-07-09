"use client";

import { GButton } from "@/component/common/GButton";
import { GSpinner } from "@/component/common/GSpinner";
import { GInputSearch } from "@/component/common/GInputSearch";
import { FriendsList } from "@/component/SocialPanel/FriendsList";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface InviteFriendProps {
  open: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loading: boolean;
  friends: IUserSummary[];
  onSelect: (friendId: string) => void;
  onClose: () => void;
}

function InviteFriend({ open, searchQuery, onSearchChange, loading, friends, onSelect, onClose }: InviteFriendProps) {
  if (!open) return null;

  return (
    <div className="bg-surface/50 border border-border/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text">Invite a Friend</h3>
        <GButton onClick={onClose} variant="secondary" size="sm">Cancel</GButton>
      </div>
      <GInputSearch value={searchQuery} onChange={onSearchChange} placeholder="Search friends..." />
      <div className="mt-3 max-h-40 overflow-y-auto custom-scrollbar">
        {loading ? (
          <GSpinner size="sm" />
        ) : friends.length > 0 ? (
          <FriendsList friends={friends} onSelectFriend={onSelect} />
        ) : (
          <p className="text-xs text-text-muted text-center py-4">No friends found</p>
        )}
      </div>
    </div>
  );
}

export { InviteFriend };
