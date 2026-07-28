export class ReconnectManager {
  private handlers = new Set<() => void>();

  handleReconnect(): void {
    this.handlers.forEach((h) => { try { h(); } catch { /* isolated */ } });
  }

  onReconnect(handler: () => void): () => void {
    this.handlers.add(handler);
    return () => { this.handlers.delete(handler); };
  }
}
