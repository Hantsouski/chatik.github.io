import TdClient from 'tdweb';
import { AllTelegramUpdates, Chat, ChatUpdates } from './api';
import { TelegramUpdates } from './telegram-updates';
import { isChatUpdates } from '.';

export class TelegramChats {
  public readonly updates = new TelegramUpdates<ChatUpdates>();

  constructor(
    private readonly tdClient: TdClient,
    private readonly telegramUpdate: TelegramUpdates<AllTelegramUpdates>,
  ) {
    this.telegramUpdate.on('any', (update) => {
      if (isChatUpdates(update['@type'])) {
        this.updates.handleUpdate(update);
      }
    });
  }

  public async get(): Promise<Chat[]> {
    const { chat_ids } = await this.tdClient.send({
      '@type': 'getChats',
      limit: 300
    }) as unknown as any;

    return await Promise.all(
      chat_ids.map((id: string) => this.tdClient.send({
        '@type': 'getChat',
        chat_id: id,
      })),
    );
  }
}
