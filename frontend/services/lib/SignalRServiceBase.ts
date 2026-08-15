import type { HubConnection } from "@microsoft/signalr";
import type { TNullable } from "@/domain/type/TCommon";
import { SubscriptionManager } from "./SubscriptionManager";
import { requireConnection, type Handler } from "./signalRUtils";

interface RegisteredHandler {
  event: string;
  handler: Handler;
}

abstract class SignalRServiceBase {
  protected connection: TNullable<HubConnection> = null;
  protected subs = new SubscriptionManager();
  private handlers: RegisteredHandler[] = [];

  setConnection(connection: HubConnection): void {
    this.unregisterHandlers();
    this.connection = connection;
    this.registerHandlers();
  }

  disconnect(): void {
    this.unregisterHandlers();
    this.connection = null;
  }

  protected requireConnection(name: string): HubConnection {
    return requireConnection(this.connection, name);
  }

  protected subscribe(key: string, handler: Handler): () => void {
    return this.subs.subscribe(key, handler);
  }

  protected addHandler(event: string, handler: Handler): void {
    this.connection!.on(event, handler);
    this.handlers.push({ event, handler });
  }

  private unregisterHandlers(): void {
    for (const { event, handler } of this.handlers) {
      this.connection?.off(event, handler);
    }
    this.handlers = [];
  }

  protected abstract registerHandlers(): void;
}

export { SignalRServiceBase };
