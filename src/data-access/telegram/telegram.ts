import TdClient, { TdObject, TdOptions } from 'tdweb';

import { TelegramUpdates } from './telegram-updates';
import TelegramAuth from './telegram-auth';
import { AllTelegramUpdates } from './api';
import { TelegramChats } from './telegram-chats';
import { TelegramMedia } from './telegram-media';

class Telegram {
  private tdClient: TdClient;

  private telegramUpdates: TelegramUpdates<AllTelegramUpdates>;
  private telegramAuth: TelegramAuth;
  private telegramChats: TelegramChats;
  private telegramMedia: TelegramMedia;

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
    this.telegramChats = new TelegramChats(this.tdClient);
    this.telegramMedia = new TelegramMedia(this.tdClient, this.telegramUpdates);
  }

  public auth(): TelegramAuth {
    return this.telegramAuth;
  }

  public chats(): TelegramChats {
    return this.telegramChats;
  }

  public media(): TelegramMedia {
    return this.telegramMedia;
  }

  public updates(): TelegramUpdates<AllTelegramUpdates> {
    return this.telegramUpdates;
  }
}

export default new Telegram();
