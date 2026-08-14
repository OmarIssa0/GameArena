const en = {
  title: "Settings",
  settings: {
    profile: {
      title: "Profile",
      subtitle: "Manage your personal information and account settings",
      firstName: "First Name",
      lastName: "Last Name",
      username: "Username",
      email: "Email",
      save: "Save Changes",
      saved: "Profile updated successfully",
      saveFailed: "Failed to save profile"
    },
    password: {
      title: "Change Password",
      subtitle: "Update your password to keep your account secure",
      oldPassword: "Old Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      save: "Update Password",
      saved: "Password changed successfully",
      saveFailed: "Failed to change password",
      invalidCurrentPassword: "Invalid current password"
    },
    preferences: {
      title: "Preferences",
      subtitle: "Customize your Arena 404 experience",
      save: "Save Preferences",
      saved: "Preferences saved",
      saveFailed: "Failed to save preferences",
      darkMode: "Dark Mode",
      language: "Language",
      sound: "Sound Effects",
      showOnline: "Show Online Status",
      showGameActivity: "Show Game Activity",
      showNotifications: "Show Notifications",
      pageSize: "Page Size"
    }
  }
}
;

type TSettingsTranslation = typeof en;

export { en, type TSettingsTranslation };
