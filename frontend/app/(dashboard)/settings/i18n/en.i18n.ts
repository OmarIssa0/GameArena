const en = {
  title: "Settings",
  settings: {
    profile: {
      title: "Profile",
      description: "Update your personal information and account settings.",
      firstName: "First Name",
      lastName: "Last Name",
      username: "Username",
      bio: "Bio",
      save: "Save Changes",
      linkedAccounts: "Linked Accounts",
      connected: "Connected",
      notConnected: "Not connected",
    },
    notifications: {
      title: "Notifications",
      description: "Manage your notification preferences and alerts.",
      save: "Save Preferences",
      push: "Push Notifications",
      email: "Email Notifications",
      friendRequests: "Friend Requests",
      gameInvites: "Game Invites",
    },
    privacy: {
      title: "Privacy",
      description: "Control your privacy settings and data sharing options.",
      save: "Update Privacy",
      showOnline: "Show online status",
      allowFriendRequests: "Allow friend requests from everyone",
      showGameActivity: "Show game activity",
    },
  },
};

type TSettingsTranslation = typeof en;

export { en, type TSettingsTranslation };
