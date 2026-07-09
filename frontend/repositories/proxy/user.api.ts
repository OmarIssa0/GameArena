import { baseURL, clientFactory } from "@/app/network";

const userApi = clientFactory(
  `${baseURL}user`,
  {
    get: {
      verb: "get",
      template: "/{id}",
    },
    profile: {
      verb: "get",
      template: "/profile",
    },
    search: {
      verb: "post",
      template: "/search",
    },
    updateProfile: {
      verb: "put",
      template: "/update-profile",
    },
    changePassword: {
      verb: "put",
      template: "/change-password",
    },
  },
  undefined,
  (json) => json,
);

export { userApi };
