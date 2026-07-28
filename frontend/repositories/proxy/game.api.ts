import { baseURL, clientFactory } from "@/app/network";
import { HttpVerbEnum } from "@/domain/enum/HttpVerbEnum";

const gameApi = clientFactory(
  `${baseURL}game`,
  {
    getCurrentState: {
      verb: HttpVerbEnum.Get,
      template: "/current-state",
    },
    findMatch: {
      verb: HttpVerbEnum.Post,
      template: "/find-match",
    },
    startGame: {
      verb: HttpVerbEnum.Post,
      template: "/start",
    },
    inviteFriend: {
      verb: HttpVerbEnum.Post,
      template: "/invite",
    },
    inviteToRoom: {
      verb: HttpVerbEnum.Post,
      template: "/invite-to-room",
    },
    leaveGame: {
      verb: HttpVerbEnum.Post,
      template: "/leave",
    },
    requestPlayAgain: {
      verb: HttpVerbEnum.Post,
      template: "/play-again",
    },
    respondPlayAgain: {
      verb: HttpVerbEnum.Post,
      template: "/respond-play-again",
    },
    cancelSearch: {
      verb: HttpVerbEnum.Post,
      template: "/cancel-search",
    },
    sendAction: {
      verb: HttpVerbEnum.Post,
      template: "/action",
    },
    acceptInvite: {
      verb: HttpVerbEnum.Post,
      template: "/accept-invite",
    },
    createLobby: {
      verb: HttpVerbEnum.Post,
      template: "/create-lobby",
    },
  },
  undefined,
  (json) => json,
);

export { gameApi };
