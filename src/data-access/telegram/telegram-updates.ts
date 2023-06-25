import { TdObject } from 'tdweb';

type UpdateHandler = (update: TdObject) => void;

export class TelegramUpdates {
  private updateHandlers: Map<string, Set<UpdateHandler>> = new Map();

  public handleUpdate(update: TdObject) {
    if (!this.updateHandlers.has(update['@type'])) {
      return;
    }

    const handlers = this.updateHandlers.get(update['@type']) || [];

    for (const fn of handlers) {
      fn(update);
    }
  }

  public on(event: string, fn: UpdateHandler) {
    if (!this.updateHandlers.has(event)) {
      this.updateHandlers.set(event, new Set([]));
    }

    this.updateHandlers.set(event, (this.updateHandlers.get(event) as Set<UpdateHandler>).add(fn));
  }
}