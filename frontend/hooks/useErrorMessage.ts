"use client";

import { useTranslation } from "@/hooks/useSetting";
import { en, type TErrorMessages } from "@/component/i18n/ErrorCode/en.i18n";
import { ar } from "@/component/i18n/ErrorCode/ar.i18n";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

export function useErrorMessage() {
  const t = useTranslation({ en, ar }) as TErrorMessages;
  return (code: ErrorCodeEnum | undefined, fallback?: string): string => {
    if (code !== undefined && code in t) return t[code];
    return fallback ?? t[ErrorCodeEnum.ServerError];
  };
}
