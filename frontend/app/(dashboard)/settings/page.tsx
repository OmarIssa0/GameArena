"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation, useTheme, useLocale } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TSettingsTranslation } from "./i18n/en.i18n";
import { en as EnTextField, type GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { GTabs } from "@/component/common/GTabs";
import { Save, User, Lock, Settings, Moon, Volume2, Activity, Gamepad2, Sliders, Languages, Bell, List } from "lucide-react";
import { GList } from "@/component/common/GList";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GTextField } from "@/component/common/GTextField";
import { GSelect } from "@/component/common/GSelect";
import { GIcon } from "@/component/common/GIcon";
import { GSpinner } from "@/component/common/GSpinner";
import { userRepository } from "@/repositories/def/UserRepository";
import { DEFAULT_USER_PREFERENCES, type IUserPreferences } from "@/domain/meta/IUserPreferences";
import { passwordValidator } from "@/lib/utils";
import { useAuth } from "@/app/providers/AuthProvider";
import { useErrorMessage } from "@/hooks/useErrorMessage";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import type { IUser } from "@/domain/meta/IUser";
import type { GTabItem } from "@/component/common/def/GTabs";
import type { TNullable } from "@/domain/type/TCommon";
import type { AxiosError } from "axios";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { SettingsTabEnum } from "@/domain/enum/SettingsTabEnum";
import { TabsVariantEnum } from "@/domain/enum/TabsVariantEnum";
import { TabsDirectionEnum } from "@/domain/enum/TabsDirectionEnum";
import { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

function SettingsPage() {
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TSettingsTranslation & GTextFieldTranslation;
  const resolveError = useErrorMessage();
  const [activeTab, setActiveTab] = useState<SettingsTabEnum>(SettingsTabEnum.Profile);
  const { updatePreferences } = useAuth();
  const [profile, setProfile] = useState<TNullable<IUser>>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<TNullable<string>>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [preferences, setPreferences] = useState<IUserPreferences>(DEFAULT_USER_PREFERENCES);
  const [prefSaving, setPrefSaving] = useState(false);
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useLocale();

  const showMessage = useCallback((msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 3000);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await userRepository.profile();
        if (!alive) return;
        if (res.data) {
          setProfile(res.data);
          setFirstName(res.data.firstName ?? "");
          setLastName(res.data.lastName ?? "");
          setUserName(res.data.userName ?? "");
          if (res.data.preferences) {
            try {
              const parsed = JSON.parse(res.data.preferences) as IUserPreferences;
              const merged = { ...DEFAULT_USER_PREFERENCES, ...parsed } as IUserPreferences;
              setPreferences(merged);
              if (merged.theme === ThemeEnum.Light || merged.theme === ThemeEnum.Dark) setTheme(merged.theme);
              if (merged.locale === LocaleEnum.En || merged.locale === LocaleEnum.Ar) setLocale(merged.locale);
            } catch {
              // fall back to defaults
            }
          }
        }
      } catch {
        // profile request failed — show error state
      } finally {
        if (alive) setLoading(false);
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, [setLocale, setTheme]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await userRepository.updateProfile({
        firstName,
        lastName,
        userName,
        email: profile.email,
        password: null,
      });
      showMessage(t.settings.profile.saved);
    } catch {
      showMessage(t.settings.profile.saveFailed);
    }
    setSaving(false);
  };

  const validatePassword = (): boolean => {
    const errs: Record<string, string> = {};
    if (!oldPassword.trim()) errs.oldPassword = t.dynamicFieldRequired(t.settings.password.oldPassword);
    const pwErr = passwordValidator(t)(newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (!confirmPassword.trim()) {
      errs.confirmPassword = t.dynamicFieldRequired(t.settings.password.confirmPassword);
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = t.invalidConfirmPassword;
    }
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;
    setSaving(true);
    try {
      await userRepository.changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
      showMessage(t.settings.password.saved);
    } catch (e: unknown) {
      const err = e as AxiosError<IApiResponse<unknown>>;
      const code = err?.response?.data?.errorCode;
      if (code === ErrorCodeEnum.InvalidCredentials) {
        setPasswordErrors({ oldPassword: t.settings.password.invalidCurrentPassword });
      } else {
        showMessage(resolveError(code, t.settings.password.saveFailed));
      }
    }
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setPrefSaving(true);
    try {
      const toPersist: IUserPreferences = {
        ...preferences,
        theme: theme as IUserPreferences["theme"],
        locale: locale as IUserPreferences["locale"],
      };
      await userRepository.updatePreferences({ preferences: JSON.stringify(toPersist) });
      updatePreferences(toPersist);
      showMessage(t.settings.preferences.saved);
    } catch {
      showMessage(t.settings.preferences.saveFailed);
    }
    setPrefSaving(false);
  };

  const togglePref = (key: keyof IUserPreferences) => {
    const next = !preferences[key];
    setPreferences((prev) => ({ ...prev, [key]: next }));
    updatePreferences({ [key]: next });
  };

  const tabs = useMemo<GTabItem<SettingsTabEnum>[]>(
    () => [
      {
        id: SettingsTabEnum.Profile,
        label: t.settings.profile.title,
        icon: <GIcon icon={User} size={SizeEnum.md} />,
      },
      {
        id: SettingsTabEnum.Password,
        label: t.settings.password.title,
        icon: <GIcon icon={Lock} size={SizeEnum.md} />,
      },
      {
        id: SettingsTabEnum.Preferences,
        label: t.settings.preferences.title,
        icon: <GIcon icon={Settings} size={SizeEnum.md} />,
      },
    ],
    [t],
  );

  const pageSizeOptions = [5, 10, 15, 20, 25];

  const prefItems: { key: keyof IUserPreferences; label: string; icon: React.ReactNode }[] = [
    { key: "soundEnabled", label: t.settings.preferences.sound, icon: <GIcon icon={Volume2} size={SizeEnum.sm} /> },
    {
      key: "showOnlineStatus",
      label: t.settings.preferences.showOnline,
      icon: <GIcon icon={Activity} size={SizeEnum.sm} />,
    },
    {
      key: "showGameActivity",
      label: t.settings.preferences.showGameActivity,
      icon: <GIcon icon={Gamepad2} size={SizeEnum.sm} />,
    },
    {
      key: "showNotifications",
      label: t.settings.preferences.showNotifications,
      icon: <GIcon icon={Bell} size={SizeEnum.sm} />,
    },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-e border-border bg-bg-sidebar">
        <div className="p-4 lg:p-6">
          <div className="mb-8">
            <header className="flex items-center gap-3">
              <GIcon icon={Settings} size={SizeEnum.xl} tile tileGradient="bg-primary" tileColor={AccentColorEnum.OnPrimary} />
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-text tracking-tight leading-tight">{t.title}</h1>
              </div>
            </header>
          </div>
          <GTabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            direction={TabsDirectionEnum.V}
            variant={TabsVariantEnum.Sidebar}
            indicator={IndicatorPositionEnum.Start}
            fullWidth
          />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 bg-bg">
        <div className="max-w-2xl mx-auto w-full">
          {saveMsg && <div className="mb-6 p-4 rounded-xl bg-success-bg border border-success text-success text-sm text-center">{saveMsg}</div>}

          {activeTab === SettingsTabEnum.Profile && (
            <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.xl} className="animate-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <GIcon icon={User} size={SizeEnum.lg} color={AccentColorEnum.Primary} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{t.settings.profile.title}</h2>
                  <p className="text-sm text-text-muted">{t.settings.profile.subtitle}</p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <GSpinner size={SizeEnum.md} />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GTextField label={t.settings.profile.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <GTextField label={t.settings.profile.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <div className="sm:col-span-2">
                      <GTextField label={t.settings.profile.username} value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <GTextField label={t.settings.profile.email} value={profile?.email ?? ""} disabled />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <GButton
                      startIcon={saving ? <GSpinner size={SizeEnum.sm} /> : <GIcon icon={Save} size={SizeEnum.sm} className="text-on-primary" />}
                      onClick={handleSaveProfile}
                      disabled={saving}>
                      {t.settings.profile.save}
                    </GButton>
                  </div>
                </>
              )}
            </GCard>
          )}

          {activeTab === SettingsTabEnum.Password && (
            <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.xl} className="animate-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-warning/10 rounded-xl">
                  <GIcon icon={Lock} size={SizeEnum.lg} color={AccentColorEnum.Warning} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{t.settings.password.title}</h2>
                  <p className="text-sm text-text-muted">{t.settings.password.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4 max-w-sm">
                <GTextField
                  label={t.settings.password.oldPassword}
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  error={passwordErrors.oldPassword}
                />
                <GTextField
                  label={t.settings.password.newPassword}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordErrors.newPassword}
                />
                <GTextField
                  label={t.settings.password.confirmPassword}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordErrors.confirmPassword}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <GButton
                  startIcon={saving ? <GSpinner size={SizeEnum.sm} /> : <GIcon icon={Save} size={SizeEnum.sm} className="text-on-primary" />}
                  onClick={handleSavePassword}
                  disabled={saving}>
                  {t.settings.password.save}
                </GButton>
              </div>
            </GCard>
          )}

          {activeTab === SettingsTabEnum.Preferences && (
            <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.xl} className="space-y-6 animate-in">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <GIcon icon={Sliders} size={SizeEnum.lg} color={AccentColorEnum.Accent} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{t.settings.preferences.title}</h2>
                  <p className="text-sm text-text-muted">{t.settings.preferences.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between py-3 border-b border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface rounded-lg group-hover:bg-primary/10 transition-colors">
                      <GIcon icon={Moon} size={SizeEnum.sm} />
                    </div>
                    <span className="text-sm text-text">{t.settings.preferences.darkMode}</span>
                  </div>
                  <GTextField
                    type="checkbox"
                    className="flex items-center justify-center"
                    size={SizeEnum.md}
                    checked={theme === ThemeEnum.Dark}
                    onChange={(e) => setTheme(e.target.checked ? ThemeEnum.Dark : ThemeEnum.Light)}
                  />
                </label>

                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface rounded-lg">
                      <GIcon icon={Languages} size={SizeEnum.sm} />
                    </div>
                    <span className="text-sm text-text">{t.settings.preferences.language}</span>
                  </div>
                  <GSelect
                    className="w-36"
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as LocaleEnum)}
                    options={[
                      { value: LocaleEnum.En, label: "English" },
                      { value: LocaleEnum.Ar, label: "العربية" },
                    ]}
                  />
                </div>

                <GList items={prefItems} keyExtractor={(item) => item.key} noPagination>
                  {(item) => (
                    <label className="flex items-center justify-between py-3 border-b border-border/50 group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface rounded-lg group-hover:bg-primary/10 transition-colors">{item.icon}</div>
                        <span className="text-sm text-text">{item.label}</span>
                      </div>
                      <GTextField
                        type="checkbox"
                        className="flex items-center justify-center"
                        checked={preferences[item.key] as boolean}
                        onChange={() => togglePref(item.key)}
                        size={SizeEnum.sm}
                      />
                    </label>
                  )}
                </GList>

                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface rounded-lg">
                      <GIcon icon={List} size={SizeEnum.sm} />
                    </div>
                    <span className="text-sm text-text">{t.settings.preferences.pageSize}</span>
                  </div>
                  <GSelect
                    className="w-20"
                    value={preferences.pageSize}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, pageSize: Number(e.target.value) }))}
                    options={pageSizeOptions.map((n) => ({ value: n, label: `${n}` }))}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <GButton
                  startIcon={prefSaving ? <GSpinner size={SizeEnum.sm} /> : <GIcon icon={Save} size={SizeEnum.sm} className="text-on-primary" />}
                  onClick={handleSavePreferences}
                  disabled={prefSaving}>
                  {t.settings.preferences.save}
                </GButton>
              </div>
            </GCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
