import TdClient, { TdObject } from 'tdweb';
import { AllTelegramUpdates, FormattedText, Message, MessagesUpdates } from './api';
import { TelegramUpdates } from './telegram-updates';
import { isMessagesUpdates } from '.';

export class TelegramMessages {
  public readonly updates = new TelegramUpdates<MessagesUpdates>();
  constructor(
    private readonly tdClient: TdClient,
    private readonly telegramUpdate: TelegramUpdates<AllTelegramUpdates>,
  ) {
    this.telegramUpdate.on('any', (update) => {
      if (isMessagesUpdates(update['@type'])) {
        this.updates.handleUpdate(update);
      }
    });
  }

  public async get({
    chat_id,
    from_message_id,
    limit
  }: {
    chat_id: string,
    limit: number,
    from_message_id?: number,
  }): Promise<Message[]> {
    const chatHistory = await this.tdClient.send({
			'@type': 'getChatHistory',
			chat_id,
			offset: 0,
			limit: limit || 50,
      from_message_id,
    }) as unknown as any;

    return chatHistory.messages;
  }

  public async send({
    chat_id,
    formatted_text
  }: {
    chat_id: string;
    formatted_text: FormattedText;
  }) {
    const inputContent = {
      '@type': 'inputMessageText',
      text: formatted_text as unknown as TdObject,
      disable_web_page_preview: false,
      clear_draft: true
    };

    this.tdClient.send({
      '@type': 'sendMessage',
      chat_id,
      reply_to_message_id: 0,
      input_message_content: inputContent
    });
  }
}
