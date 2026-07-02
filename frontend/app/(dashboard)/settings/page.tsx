"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TSettingsTranslation } from "./i18n/en.i18n";
import { GTabs } from "@/component/common/GTabs";
import { User, Bell, Shield, Save } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GTabItem } from "@/component/common/def/GTabs";

type SettingsTab = "profile" | "notifications" | "privacy";

function SettingsPage() {
  const t = useTranslation({ en, ar }) as TSettingsTranslation;
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = useMemo<GTabItem<SettingsTab>[]>(
    () => [
      {
        id: "profile",
        label: t.settings.profile.title,
        icon: <User size={18} />,
      },
      {
        id: "notifications",
        label: t.settings.notifications.title,
        icon: <Bell size={18} />,
      },
      {
        id: "privacy",
        label: t.settings.privacy.title,
        icon: <Shield size={18} />,
      },
    ],
    [t],
  );

  const notificationItems = [
    { key: "push", label: t.settings.notifications.push },
    { key: "email", label: t.settings.notifications.email },
    { key: "friendRequests", label: t.settings.notifications.friendRequests },
    { key: "gameInvites", label: t.settings.notifications.gameInvites },
  ] as const;

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border/50 bg-bg-sidebar">
        <div className="p-4 lg:p-6">
          <h1 className="text-2xl font-bold text-text mb-4 lg:mb-8">
            {t.title}
          </h1>
          <GTabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            direction="V"
            variant="sidebar"
            fullWidth
          />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 bg-bg-card/30">
        <div className="max-w-2xl mx-auto animate-fade-in">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="surface-card p-6">
                <h2 className="text-xl font-bold text-text mb-4">
                  {t.settings.profile.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {t.settings.profile.firstName}
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="field-input pl-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {t.settings.profile.lastName}
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="field-input pl-3"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {t.settings.profile.username}
                    </label>
                    <input
                      type="text"
                      defaultValue="johndoe"
                      className="field-input pl-3"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {t.settings.profile.bio}
                    </label>
                    <textarea
                      rows={3}
                      className="field-input pl-3 resize-none"
                      defaultValue="A passionate gamer who loves strategy games."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <GButton leftIcon={<Save size={16} />}>
                    {t.settings.profile.save}
                  </GButton>
                </div>
              </div>

              <div className="surface-card p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  {t.settings.profile.linkedAccounts}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-text">Discord</span>
                    <span className="text-xs font-medium text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">
                      {t.settings.profile.connected}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-text">Google</span>
                    <span className="text-xs font-medium text-text-muted bg-text-muted/10 px-2 py-0.5 rounded-full">
                      {t.settings.profile.notConnected}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-text">Twitch</span>
                    <span className="text-xs font-medium text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">
                      {t.settings.profile.connected}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="surface-card p-6 space-y-5">
              <h2 className="text-xl font-bold text-text">
                {t.settings.notifications.title}
              </h2>
              <div className="space-y-4">
                {notificationItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-text">{item.label}</span>
                    <input
                      type="checkbox"
                      defaultChecked={item.key !== "email"}
                      className="w-5 h-5 accent-primary rounded"
                    />
                  </label>
                ))}
              </div>
              <div className="flex justify-end">
                <GButton>{t.settings.notifications.save}</GButton>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="surface-card p-6 space-y-5">
              <h2 className="text-xl font-bold text-text">
                {t.settings.privacy.title}
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-text">
                    {t.settings.privacy.showOnline}
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-text">
                    {t.settings.privacy.allowFriendRequests}
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-text">
                    {t.settings.privacy.showGameActivity}
                  </span>
                  <input type="checkbox" className="accent-primary" />
                </label>
              </div>
              <div className="flex justify-end">
                <GButton>{t.settings.privacy.save}</GButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
