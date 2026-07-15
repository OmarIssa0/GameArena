import type { HubConnection } from "@microsoft/signalr";

type Handler = (...args: unknown[]) => void;

function dispatch(handlers: Set<Handler> | undefined, ...args: unknown[]): void {
  if (!handlers) return;
  for (const h of handlers) {
    try { h(...args); } catch { /* isolated */ }
  }
}

function requireConnection(connection: HubConnection | null, name: string): HubConnection {
  if (!connection) throw new Error(`${name} connection not established`);
  return connection;
}

export type { Handler };
export { dispatch, requireConnection };
