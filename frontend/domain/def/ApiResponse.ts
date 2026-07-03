import { ErrorCodeEnum } from "../enum/ErrorCodeEnum";
import type { IApiResponse } from "../meta/IApiResponse";
import type { TNullable } from "@/domain/type/TCommon";

class ApiResponse<T> implements IApiResponse<T> {
  success: boolean;
  data: TNullable<T>;
  message: string;
  errorCode: ErrorCodeEnum;

  constructor(
    Success: boolean,
    Data: TNullable<T>,
    Message: string,
    ErrorCode: ErrorCodeEnum,
  ) {
    this.success = Success;
    this.data = Data;
    this.message = Message;
    this.errorCode = ErrorCode;
  }
}

export { ApiResponse };
