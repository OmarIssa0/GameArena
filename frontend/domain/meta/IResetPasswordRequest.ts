import type { TNullable } from "@/domain/type/TCommon";

interface IResetPasswordRequest {
  email: TNullable<string>;
  newPassword: TNullable<string>;
  otp: TNullable<string>;
}
export type { IResetPasswordRequest };
