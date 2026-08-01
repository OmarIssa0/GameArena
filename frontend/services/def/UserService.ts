import { userRepository } from "@/repositories/def/UserRepository";
import { withFullName } from "@/domain/lib/userUtils";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { TPromise } from "@/domain/type/TCommon";

import type { IUserService } from "../meta/IUserService";
class UserService implements IUserService {
  private repo = userRepository;

  async profile(): TPromise<IUser> {
    const result = await this.repo.profile();
    if (result.data) result.data = withFullName(result.data);
    return result;
  }

  async list(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    const result = await this.repo.list(data);
    if (result.data) result.data = result.data.map(withFullName);
    return result;
  }
}

export const userService = new UserService();
