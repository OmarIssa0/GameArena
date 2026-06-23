import AuthLayout from "@/component/auth/AuthLayout";
import LoginForm from "@/component/auth/loginForm";

export default function Page() {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  );
}
