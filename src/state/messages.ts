import { CloseMode, fromView, metaStream, syncRAF } from '@thi.ng/rstream';
import { DB, selectedChatId, isAuthorized, Message } from '.';
import telegram from '../data-access/telegram/telegram';
import { filter, trace } from '@thi.ng/transducers';

const telegramMessages = telegram.messages();

export const messages = syncRAF(
  fromView(DB, {
    path: ['messages'],
  }),
  {
    id: 'messages',
    closeOut: CloseMode.NEVER,
  }
);

messages.transform(trace('messages: '));

const addMessages = (messages: Message[]) => DB.resetIn(['messages'], messages);

isAuthorized
  .transform(filter(Boolean))
  .subscribe(metaStream(() => selectedChatId.transform(filter(id => !!id))))
  .subscribe(({ next: async (selectedChatId) => {
    const [ lastMessage ] = await telegramMessages.get({
      chat_id: selectedChatId,
    });

    addMessages([lastMessage]);

    const restMessages = await telegramMessages.get({
      chat_id: selectedChatId,
      from_message_id: lastMessage.id,
    });

    addMessages(restMessages);
}}));
