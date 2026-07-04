import type { HubConnection } from "@microsoft/signalr";
import type { TNullable } from "../type/TCommon";

interface IConnectionContext {
  chatConnection: TNullable<HubConnection>;
  gameConnection: TNullable<HubConnection>;
  notificationConnection: TNullable<HubConnection>;
  isChatConnected: boolean;
  isGameConnected: boolean;
  isNotificationConnected: boolean;
}

export type { IConnectionContext };
