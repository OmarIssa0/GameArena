import { HubConnectionState } from "@microsoft/signalr";

/**
 * Connection state enum for SignalR hubs.
 * Mirrors SignalR's internal states but simplified.
 */
export enum ConnectionState {
  /** Not connected and not attempting to connect */
  Disconnected = "disconnected",
  /** Attempting to establish connection (initial connect or reconnect) */
  Connecting = "connecting",
  /** Connection established and operational */
  Connected = "connected",
  /** Connection lost, attempting automatic reconnect */
  Reconnecting = "reconnecting",
}

/**
 * Per-hub connection state tracking.
 */
export interface HubConnectionStates {
  chat: ConnectionState;
  game: ConnectionState;
  social: ConnectionState;
}

/**
 * Helper: map SignalR connection state to our enum.
 */
export function fromSignalRState(state: HubConnectionState): ConnectionState {
  switch (state) {
    case HubConnectionState.Connected:
      return ConnectionState.Connected;
    case HubConnectionState.Connecting:
      return ConnectionState.Connecting;
    case HubConnectionState.Reconnecting:
      return ConnectionState.Reconnecting;
    default:
      return ConnectionState.Disconnected;
  }
}
