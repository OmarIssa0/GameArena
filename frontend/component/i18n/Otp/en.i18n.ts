const en = {
  enterFullCode: "Please enter the full code",
  resendCode: "Resend code",
  verify: "Verify",
  invalidCode: "Invalid code",
  resendCodeFailed: "Failed to resend code",
  digitLabel: (n: number) => `Digit ${n} of 6`
}
;

type TOtpTranslation = typeof en;
export { en, type TOtpTranslation };
