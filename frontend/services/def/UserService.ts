import { userApi } from "@/repositories/proxy/user.api";
import { withFullName } from "@/domain/lib/userUtils";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IRegisterRequest } from "@/domain/meta/IRegisterRequest";
import type { TNullable, TPromise } from "@/domain/type/TCommon";

class UserService {
  private api = userApi.api;

  async profile(): TPromise<IUser> {
    const result = await this.api.profile<IUser>();
    if (result.data) result.data = withFullName(result.data);
    return result;
  }

  async list(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    const result = await this.api.search<IUserSummary[]>(data);
    if (result.data) result.data = result.data.map(withFullName);
    return result;
  }

  updateProfile(data: IRegisterRequest): TPromise<IUser> {
    return this.api.updateProfile<IUser>(data);
  }

  changePassword(data: { oldPassword: string; newPassword: string }): TPromise<unknown> {
    return this.api.changePassword<unknown>(data);
  }

  getPreferences(): TPromise<TNullable<string>> {
    return this.api.getPreferences<TNullable<string>>();
  }

  updatePreferences(data: { preferences: string }): TPromise<unknown> {
    return this.api.updatePreferences<unknown>(data);
  }
}

export const userService = new UserService();