import AuthLayout from "@/component/auth/AuthLayout";
import RegisterForm from "@/component/auth/RegisterForm";

export default function Page() {
  return (
    <AuthLayout title="Create account">
      <RegisterForm />
    </AuthLayout>
  );
}
