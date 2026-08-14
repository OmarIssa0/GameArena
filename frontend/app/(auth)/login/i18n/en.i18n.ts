import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

const en = {
  login: "Login",
  signIn: "Sign in",
  loggingIn: "Logging in...",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot password?",
  dontHaveAccount: "Don't have an account?",
  register: "Register",
  createAccount: "Create account",
  verifyEmail: "Verify Email",
  unknownError: "An unknown error occurred",
  loginDescription: "Welcome back. Please login to continue.",
  loginErrorCodeEnum: {
    [ErrorCodeEnum.InvalidCredentials]: "Invalid email or password",
    [ErrorCodeEnum.Unauthorized]: "Unauthorized",
    [ErrorCodeEnum.TokenExpired]: "Token expired",
    [ErrorCodeEnum.EmailNotVerified]: "Email not verified",
    [ErrorCodeEnum.RefreshTokenInvalid]: "Refresh token invalid"},
  placeholder: {
    email: "Enter your email",
    password: "Enter your password"
  }
}
;

export { en };

export type TLoginTranslation = typeof en;
