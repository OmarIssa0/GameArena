"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/auth.api";
import { ErrorCode, TError, TFieldLogin } from "@/types";
import TTextField from "@/component/common/TTextField";
import TButton from "@/component/common/TButton";
import { default as EnTextField } from "@/component/i18n/TTextField/en.i18n";
import { default as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import en, { type TLoginTranslation } from "@/app/login/i18n/en.i18n";
import ar from "@/app/login/i18n/ar.i18n";
import { emailValidator, passwordValidator } from "@/utils";

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TLoginTranslation;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({
    link: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = (emailVal: string, passwordVal: string) => {
    return {
      email: emailValidator(t)(emailVal) || "",
      password: passwordValidator(t)(passwordVal) || "",
    };
  };
  const handleChange = (field: TFieldLogin, value: string) => {
    if (field == "email") setEmail(value);
    if (field == "password") setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const submit = async () => {
    const nextErrors = validate(email, password);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some((error) => error)) return;

    try {
      setLoading(true);
      setApiError({ link: "", message: "" });

      await authApi.login({ email, password });

      router.replace("/home");
    } catch (e: unknown) {
      const err = e as TError;
      const code = err?.response?.data?.errorCode;

      if (code === ErrorCode.EmailNotVerified)
        setApiError({
          link: "/verify-email",
          message:
            t.loginErrorCodeEnum[code as keyof typeof t.loginErrorCodeEnum],
        });
      else {
        setApiError({
          link: "",
          message:
            t.loginErrorCodeEnum[code as keyof typeof t.loginErrorCodeEnum] ||
            err?.response?.data?.message ||
            "An error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-sm space-y-5">
      <h1 className="text-3xl font-bold">{t.login}</h1>

      <div className="space-y-4">
        <TTextField
          label={t.email}
          value={email}
          type="email"
          required
          error={errors.email}
          onChange={(value) => handleChange("email", value)}
        />

        <TTextField
          label={t.password}
          value={password}
          type="password"
          required
          error={errors.password}
          onChange={(value) => handleChange("password", value)}
        />

        {apiError.message && (
          <div className="text-sm text-red-500">
            {apiError.message}{" "}
            {apiError.link && (
              <Link href={apiError.link} className="text-primary font-medium">
                {t.verifyEmail}
              </Link>
            )}
          </div>
        )}
        <TButton
          title={loading ? t.loggingIn : t.login}
          loading={loading}
          onClick={submit}
        />
      </div>

      <div className="flex justify-between text-sm pt-2">
        <Link href="/forgot-password" className="text-primary font-medium">
          {t.forgotPassword}
        </Link>

        <div className="text-text-secondary">
          {t.dontHaveAccount}{" "}
          <Link href="/register" className="text-primary font-medium">
            {t.register}
          </Link>
        </div>
      </div>
    </div>
  );
}
