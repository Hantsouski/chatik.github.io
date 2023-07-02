import { CloseMode, fromView, metaStream, syncRAF } from '@thi.ng/rstream';
import { distinct, filter, trace } from '@thi.ng/transducers';
import { Chat, DB, isAuthorized } from '.';
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
).transform(distinct());

chats.transform(trace('chats: '));

isAuthorized
  .transform(filter(Boolean))
  .subscribe(metaStream(delayedStream(500)))
  .subscribe({ next: async () => {
    const chats = await fetchChats();
    setChats(chats);
}});

const setChats = (chats: Chat[]) => DB.resetIn(['chats'], chats);

const fetchChats = () => telegramChats.get();
