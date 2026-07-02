"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/app/(auth)/layout";
import { OtpForm } from "@/component/auth/OtpForm";
import { AuthFlowAnimationEnum } from "@/domain/enum/AuthFlowAnimationEnum";
import { useEffect } from "react";

function EmailVerifyPage() {
  const router = useRouter();
  const email = useSearchParams().get("email");

  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  if (!email) return null;

  return (
    <AuthLayout page={AuthFlowAnimationEnum.VERIFY_OTP}>
      <OtpForm email={email} onSuccess={() => router.replace("/home")} />
    </AuthLayout>
  );
}

export default EmailVerifyPage;
