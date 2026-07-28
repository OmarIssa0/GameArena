"use client";

import { Frown, Search, UserPlus } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GList } from "@/component/common/GList";
import { GSpinner } from "@/component/common/GSpinner";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import type { InviteModalProps } from "./def/InviteModal";
import { GTextField } from "@/component/common/GTextField";

function InviteModal({
  open,
  searchQuery,
  onSearchChange,
  loading,
  friends,
  onSelect,
  onClose,
  title = "Invite a Friend",
  cancelLabel = "Cancel",
  searchPlaceholder = "Search friends...",
  noFriendsText = "No friends found",
}: InviteModalProps) {
  if (!open) return null;

  return (
    <GCard variant="outlined" padding="sm" className="bg-surface/50 border-border/60">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <GButton onClick={onClose} variant="secondary" size="sm">
          {cancelLabel}
        </GButton>
      </div>
      <GTextField
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        startIcon={<GIcon icon={Search} size="sm" color="muted" />}
      />
      <div className="mt-3 max-h-40 overflow-y-auto custom-scrollbar">
        {loading ? (
          <GSpinner size="sm" />
        ) : friends.length > 0 ? (
          <GList items={friends} keyExtractor={(friend) => friend.id}>
            {(friend) => (
              <GButton
                key={friend.id}
                variant="ghost"
                fullWidth
                className="justify-start text-sm"
                startIcon={<GIcon icon={UserPlus} size="sm" color="inherit" />}
                onClick={() => onSelect(friend.id)}>
                {friend.fullName ?? friend.userName}
              </GButton>
            )}
          </GList>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-text-muted text-sm">
            <GIcon icon={Frown} size="lg" color="muted" className="mb-1" />
            {noFriendsText}
          </div>
        )}
      </div>
    </GCard>
  );
}

export { InviteModal };
