import { baseURL, clientFactory } from "@/app/network";

const gameApi = clientFactory(
  `${baseURL}game`,
  {
    getCurrentState: {
      verb: "get",
      template: "/current-state",
    },
    findMatch: {
      verb: "post",
      template: "/find-match",
    },
    startGame: {
      verb: "post",
      template: "/start",
    },
    inviteFriend: {
      verb: "post",
      template: "/invite",
    },
    inviteToRoom: {
      verb: "post",
      template: "/invite-to-room",
    },
    leaveGame: {
      verb: "post",
      template: "/leave",
    },
    requestPlayAgain: {
      verb: "post",
      template: "/play-again",
    },
    respondPlayAgain: {
      verb: "post",
      template: "/respond-play-again",
    },
    cancelSearch: {
      verb: "post",
      template: "/cancel-search",
    },
    sendAction: {
      verb: "post",
      template: "/action",
    },
    acceptInvite: {
      verb: "post",
      template: "/accept-invite",
    },
    createLobby: {
      verb: "post",
      template: "/create-lobby",
    },
  },
  undefined,
  (json) => json,
);

export { gameApi };