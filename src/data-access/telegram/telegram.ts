import TdClient, { TdObject, TdOptions } from 'tdweb';

import { TelegramUpdates } from './telegram-updates';
import TelegramAuth from './telegram-auth';

export class Telegram {
  private tdClient: TdClient;

  private telegramUpdates: TelegramUpdates;
  private telegramAuth: TelegramAuth;

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

    const apiKey = {
      id: import.meta.env.VITE_TELEGRAM_API_ID,
      hash: import.meta.env.VITE_TELEGRAM_API_HASH,
    };

    this.telegramAuth = new TelegramAuth(this.tdClient, this.telegramUpdates, apiKey);
  }

  public auth(): TelegramAuth {
    return this.telegramAuth;
  }

  public updates(): TelegramUpdates {
    return this.telegramUpdates;
  }
}
