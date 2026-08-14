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
