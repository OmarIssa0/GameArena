import type { Handler } from "./signalRUtils";
import { dispatch } from "./signalRUtils";

class SubscriptionManager {
  private handlers = new Map<string, Set<Handler>>();

  subscribe(event: string, handler: Handler): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler);
    return () => {
      set!.delete(handler);
      if (set!.size === 0) {
        this.handlers.delete(event);
      }
    };
  }

  dispatch(event: string, ...args: unknown[]): void {
    dispatch(this.handlers.get(event), ...args);
  }
}

export { SubscriptionManager };
