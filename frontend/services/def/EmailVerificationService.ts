import { emailVerificationRepository } from "@/repositories/def/EmailVerificationRepository";
import type { ISendOtpRequest } from "@/domain/meta/ISendOtpRequest";
import type { IVerifyOtpRequest } from "@/domain/meta/IVerifyOtpRequest";
import type { TPromise } from "@/domain/type/TCommon";

import type { IEmailVerificationService } from "../meta/IEmailVerificationService";
class EmailVerificationService implements IEmailVerificationService {
  private repo = emailVerificationRepository;

  sendOtp(data: ISendOtpRequest): TPromise<void> {
    return this.repo.sendOtp(data);
  }

  verifyOtp(data: IVerifyOtpRequest): TPromise<void> {
    return this.repo.verifyOtp(data);
  }
}

export const emailVerificationService = new EmailVerificationService();
