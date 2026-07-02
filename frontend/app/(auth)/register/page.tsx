"use client";
import { AuthLayout } from "@/app/(auth)/layout";
import { RegisterForm } from "@/component/auth/RegisterForm";
import { AuthFlowAnimationEnum } from "@/domain/enum/AuthFlowAnimationEnum";

function RegisterPage() {
  return (
    <AuthLayout page={AuthFlowAnimationEnum.REGISTER}>
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
