import { TdObject } from 'tdweb';

type UpdateHandler = (update: TdObject) => void;

export class TelegramUpdates<Updates extends string> {
  private subscribers: Map<string, Set<UpdateHandler>> = new Map();

  public handleUpdate(update: TdObject) {
    if (!this.subscribers.has(update['@type']) && !this.subscribers.has('any')) {
      return;
    }

    const subscribers = this.subscribers.get(update['@type']) || [];

    for (const fn of subscribers) {
      fn(update);
    }

    const subscribersForAnyUpdates = this.subscribers.get('any') || [];

    for (const fn of subscribersForAnyUpdates) {
      fn(update);
    }
  }

  public on(event: Updates, fn: UpdateHandler) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set([]));
    }

    this.subscribers.set(event, (this.subscribers.get(event) as Set<UpdateHandler>).add(fn));
  }
}
