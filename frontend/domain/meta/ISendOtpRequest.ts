import type { TNullable } from "@/domain/type/TCommon";

interface ISendOtpRequest {
  email: TNullable<string>;
}
export type { ISendOtpRequest };
