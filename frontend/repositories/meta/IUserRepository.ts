import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { IChangePasswordRequest } from "@/domain/meta/IChangePasswordRequest";
import type { TPromise } from "@/domain/type/TCommon";

interface IUserRepository {
  getById(userId: string): TPromise<IUser>;
  profile(): TPromise<IUser>;
  list(data: IUserFilterRequest): TPromise<IUserSummary[]>;
  updateProfile(data: IRegisterRequest): TPromise<IUser>;
  changePassword(data: IChangePasswordRequest): TPromise<void>;
}
export type { IUserRepository };
