import TdClient from 'tdweb';
import { Chat } from './api';

export class TelegramChats {
  constructor(
    private readonly tdClient: TdClient,
  ) {}

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
