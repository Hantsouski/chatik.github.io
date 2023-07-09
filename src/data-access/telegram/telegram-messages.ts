import TdClient from 'tdweb';
import { Message } from './api';

export class TelegramMessages {
  constructor(
    private readonly tdClient: TdClient,
  ) {
  }

  public async get({
    chat_id,
    from_message_id,
  }: {
    chat_id: string,
    from_message_id?: number,
  }): Promise<Message[]> {
    const chatHistory = await this.tdClient.send({
			'@type': 'getChatHistory',
			chat_id,
			offset: 0,
			limit: 50,
      from_message_id,
    }) as unknown as any;

    return chatHistory.messages;
  }
}
