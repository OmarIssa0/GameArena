import { ErrorCodeEnum } from "../enum/ErrorCodeEnum";
import type { TNullable } from "../type/TCommon";

interface IApiResponse<T> {
  Success: boolean;
  Data: TNullable<T>;
  Message: string;
  ErrorCode: ErrorCodeEnum;
}
export type { IApiResponse };
