import type { TNullable } from "@/domain/type/TCommon";

interface IForgotPasswordRequest {
  email: TNullable<string>;
}
export type { IForgotPasswordRequest };
