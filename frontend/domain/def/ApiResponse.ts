import { ErrorCodeEnum } from "../enum/ErrorCodeEnum";
import type { IApiResponse } from "../meta/IApiResponse";
import type { TNullable } from "@/domain/type/TCommon";

class ApiResponse<T> implements IApiResponse<T> {
  success: boolean;
  data: TNullable<T>;
  message: string;
  errorCode: ErrorCodeEnum;

  constructor(
    success: boolean,
    data: TNullable<T>,
    message: string,
    errorCode: ErrorCodeEnum,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errorCode = errorCode;
  }
}

export { ApiResponse };
