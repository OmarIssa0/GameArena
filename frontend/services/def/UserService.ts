import { userRepository } from "@/repositories/def/UserRepository";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TPromise } from "@/domain/type/TCommon";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IUserService } from "../meta/IUserService";
import type { IUserRepository } from "@/repositories/meta/IUserRepository";

class UserService implements IUserService {
  constructor(private repo: IUserRepository) {}
  getById(userId: string): TPromise<IUser> {
    return this.repo.getById(userId);
  }

  profile(): TPromise<IUser> {
    return this.repo.profile();
  }

  list(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    return this.repo.list(data);
  }
}

const userService = new UserService(userRepository);

export { userService };
