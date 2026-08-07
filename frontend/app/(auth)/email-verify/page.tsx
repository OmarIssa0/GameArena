"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/app/(auth)/layout";
import { OtpForm } from "@/component/auth/OtpForm";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { emailVerificationService } from "@/services/def/EmailVerificationService";
import { authService } from "@/services/def/AuthService";
import { useErrorMessage } from "@/hooks/useErrorMessage";
import { emailValidator } from "@/lib/utils";
import { en as EnTextField, type GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { AxiosError } from "axios";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import { ar as arEmailVerify } from "./i18n/ar.i18n";
import { en as enEmailVerify, type TEmailVerifyTranslation } from "./i18n/en.i18n";

function EmailVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const passwordParam = searchParams.get("password");

  const t = useTranslation({
    en: { ...enEmailVerify, ...EnTextField },
    ar: { ...arEmailVerify, ...ArTextField },
  }) as TEmailVerifyTranslation & GTextFieldTranslation;
  const resolveError = useErrorMessage();

  const [email, setEmail] = useState(emailParam || "");
  const [step, setStep] = useState(emailParam ? "otp" : "email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const sendCode = async () => {
    const err = emailValidator(t)(email);
    setEmailError(err || "");
    if (err || loading) return;

    try {
      setLoading(true);
      setError("");
      await emailVerificationService.sendOtp({ email });
      setStep("otp");
    } catch (e: unknown) {
      const err = e as AxiosError<IApiResponse<unknown>>;
      setError(resolveError(err?.response?.data?.errorCode, t.errorSendFailed));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = async () => {
    if (passwordParam) {
      try {
        await authService.login({ email, password: passwordParam });
        router.replace("/home");
        return;
      } catch {
        // auto-login failed, go to login page
      }
    }
    router.replace("/login");
  };

  const backToLogin = (
    <div className="pt-2 text-center">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
        <GIcon icon={ArrowLeft} size={SizeEnum.sm} flip />
        {t.backToLogin}
      </Link>
    </div>
  );

  if (step === "otp") {
    return (
      <AuthLayout>
        <div className="w-full space-y-4">
          <p className="text-sm text-text-secondary text-center">{t.enterCode}</p>
          {error && (
            <p role="alert" className="text-error text-xs text-center">
              {error}
            </p>
          )}
          <OtpForm email={email} onSuccess={handleOtpSuccess} />
          {backToLogin}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full space-y-5">
        <p className="text-sm text-text-secondary">{t.description}</p>
        <GTextField
          label={t.enterEmail}
          placeholder={t.enterEmail}
          value={email}
          type="email"
          required
          error={emailError}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          className="w-full"
        />
        {error && (
          <p role="alert" className="text-error text-xs">
            {error}
          </p>
        )}
        <GButton loading={loading} loadingText={t.sending} onClick={sendCode} fullWidth>
          {t.sendCode}
        </GButton>
        {backToLogin}
      </div>
    </AuthLayout>
  );
}

export default EmailVerifyPage;
