"use client";
import { AuthLayout } from "@/app/(auth)/layout";
import { RegisterForm } from "@/component/auth/RegisterForm";
import { AuthFlowAnimationEnum } from "@/types";

function RegisterPage() {
  return (
    <AuthLayout page={AuthFlowAnimationEnum.REGISTER}>
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
