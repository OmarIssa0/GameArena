import type { TNullable } from "@/domain/type/TCommon";

interface ILoginRequest {
  email: TNullable<string>;
  password: TNullable<string>;
}
export type { ILoginRequest };
