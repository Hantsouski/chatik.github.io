import TdClient, { TdObject, TdOptions } from 'tdweb';

import { TelegramUpdates } from './telegram-updates';

export class Telegram {
  private readonly tdClient: TdClient;

  private readonly telegramUpdates: TelegramUpdates;

  constructor() {
    this.telegramUpdates = new TelegramUpdates();
  
    const options: TdOptions = {
      logVerbosityLevel: 1,
      jsLogVerbosityLevel: 'info',
      mode: 'wasm', // 'wasm-streaming', 'wasm', 'asmjs'
      instanceName: 'tdlib-dev',
      readOnly: false,
      isBackground: false,
      useDatabase: true,
      onUpdate: (update: TdObject) => this.telegramUpdates.handleUpdate(update),
    };

    this.tdClient = new TdClient(options);
  }

  public updates(): TelegramUpdates {
    return this.telegramUpdates;
  }
}
