import type { TNullable } from "@/domain/type/TCommon";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

function buildFullName(first: TNullable<string>, last: TNullable<string>): string {
  return `${first ?? ""} ${last ?? ""}`.trim();
}

function withFullName<T extends IUserSummary>(user: T): T {
  return {
    ...user,
    fullName: buildFullName(user.firstName, user.lastName) || user.userName || user.id,
  };
}

export { buildFullName, withFullName };
