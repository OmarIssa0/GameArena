import { ErrorCode } from "@/types";

const en = {
  login: "Login",
  fillRequiredFields: "Please fill in all required fields",
  invalidCredentials: "Invalid email or password",
  signIn: "Sign in",
  loggingIn: "Logging in...",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot password?",
  dontHaveAccount: "Don't have an account?",
  register: "Register",
  welcomeBack: "Welcome back",
  loadingElipse: "Loading...",
  createAccount: "Create account",
  verifyEmail: "Verify Email",
  loginDescription: "Welcome back. Please login to continue.",
  switchLanguage: (lang: string) =>
    `Switch to ${lang === "en" ? "Arabic" : "English"}`,
  loginErrorCodeEnum: {
    [ErrorCode.InvalidCredentials]: "Invalid email or password",
    [ErrorCode.Unauthorized]: "Unauthorized",
    [ErrorCode.TokenExpired]: "Token expired",
    [ErrorCode.EmailNotVerified]: "Email not verified",
    [ErrorCode.RefreshTokenInvalid]: "Refresh token invalid",
  },
};

export default en;

export type TLoginTranslation = typeof en;
