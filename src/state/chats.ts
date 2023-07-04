import { CloseMode, fromView, metaStream, syncRAF } from '@thi.ng/rstream';
import { distinct, filter, map, trace } from '@thi.ng/transducers';
import { beginTransaction } from '@thi.ng/atom';
import { Chat, ChatPosition, DB, Message, isAuthorized } from '.';
import telegram from '../data-access/telegram/telegram';
import { delayedStream } from '../common';

const telegramChats = telegram.chats();

export const chats = syncRAF(
  fromView(DB, {
    path: ['chats'],
  }),
  {
    id: 'chatsState',
    closeOut: CloseMode.NEVER,
  }
).transform(
  map(chats => chats.sort((a, b) => Number(b.positions[0].order) - Number(a.positions[0].order))),
  distinct<Chat[]>(),
);

chats.transform(trace('chats: '));

isAuthorized
  .transform(filter(Boolean))
  .subscribe(metaStream(delayedStream(500)))
  .subscribe({ next: async () => {
    setChats(await fetchChats());
}});

const setChats = (chats: Chat[]) => DB.resetIn(['chats'], chats);

const fetchChats = () => telegramChats.get();

telegramChats.updates.on('updateChatLastMessage', update => {
  const currentChats = chats.deref()!;

  const index = currentChats.findIndex(chat => chat.id === update.chat_id);

  if (index === -1 || !update.last_message) {
    return;
  }

  if (!(update.positions as []).length) {
    DB.resetIn(['chats', index, 'last_message'], update.last_message as unknown as Message);

    return;
  }

  const tx = beginTransaction(DB);

  tx.resetIn(['chats', index, 'last_message'], update.last_message as unknown as Message);
  tx.resetIn(['chats', index, 'positions'], update.positions as unknown as ChatPosition[]);

  tx.commit();
});

telegramChats.updates.on('updateChatPosition', update => {
  const currentChats = chats.deref()!;

  const index = currentChats.findIndex(chat => chat.id === update.chat_id);

  if (index === -1 || !update.position) {
    return;
  }

  DB.resetIn(['chats', index, 'positions', 0], update.position as unknown as ChatPosition);
});

telegramChats.updates.on('updateChatReadInbox', update => {
  const currentChats = chats.deref()!;

  const index = currentChats.findIndex(chat => chat.id === update.chat_id);

  if (index === -1) {
    return;
  }

  DB.resetIn(['chats', index, 'unread_count'], update.unread_count as number);
});
