import type { TNullable } from "@/domain/type/TCommon";

interface IVerifyOtpRequest {
  email: TNullable<string>;
  otp: TNullable<string>;
}
export type { IVerifyOtpRequest };
