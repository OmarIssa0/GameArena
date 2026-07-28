import type { HubConnection } from "@microsoft/signalr";
import type { TNullable } from "../type/TCommon";
import type { HubConnectionStates } from "../enum/ConnectionState";

interface IConnectionContext {
  chatConnection: TNullable<HubConnection>;
  gameConnection: TNullable<HubConnection>;
  socialConnection: TNullable<HubConnection>;
  /** Connection states per hub (disconnected/connecting/connected/reconnecting) */
  connectionStates: HubConnectionStates;
  /** True when hub is in Connected state */
  isChatConnected: boolean;
  isGameConnected: boolean;
  isSocialConnected: boolean;
  /** True when hub is in Connecting or Reconnecting state */
  isChatConnecting: boolean;
  isGameConnecting: boolean;
  isSocialConnecting: boolean;
  /** True when all hubs are in Connected state */
  isAllConnected: boolean;
  socialReconnectKey: number;
  stopConnections: () => Promise<void>;
}

export type { IConnectionContext };
