import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

const ar = {
  login: "تسجيل الدخول",
  loggingIn: "جار تسجيل الدخول...",
  signIn: "تسجيل الدخول",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  forgotPassword: "نسيت كلمة المرور؟",
  dontHaveAccount: "ليس لديك حساب؟",
  register: "تسجيل",
  createAccount: "إنشاء حساب",
  verifyEmail: "تأكيد البريد الإلكتروني",
  unknownError: "حدث خطأ غير معروف",
  loginDescription: "مرحبًا بعودتك. يرجى تسجيل الدخول للمتابعة.",
  loginErrorCodeEnum: {
    [ErrorCodeEnum.InvalidCredentials]:
      "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    [ErrorCodeEnum.Unauthorized]: "غير مصرح",
    [ErrorCodeEnum.TokenExpired]: "انتهت صلاحية الرمز",
    [ErrorCodeEnum.EmailNotVerified]: "البريد الإلكتروني غير مؤكد",
    [ErrorCodeEnum.RefreshTokenInvalid]: "رمز التحديث غير صالح"},
  placeholder: {
    email: "أدخل بريدك الإلكتروني",
    password: "أدخل كلمة المرور الخاصة بك"
  }
}
;

export { ar };
