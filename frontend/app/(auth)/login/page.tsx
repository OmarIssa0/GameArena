"use client";

import { AuthLayout } from "../layout";
import { LoginForm } from "@/component/auth/LoginForm";

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
