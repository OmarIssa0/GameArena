import { baseURL, clientFactory } from "@/app/network";

const matchHistoryApi = clientFactory(
  `${baseURL}MatchHistory`,
  {
    getMatchHistory: {
      verb: "get",
      template: "",
    },
  },
  undefined,
  (data) => data,
);

export { matchHistoryApi };
