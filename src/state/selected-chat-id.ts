import { CloseMode, fromView, sync, syncRAF } from '@thi.ng/rstream';
import { DB, chatsLoaded, chats } from '.';
import { dedupe, filter, map } from '@thi.ng/transducers';

export const selectedChatId = syncRAF(
  fromView(DB, {
    path: ['selectedChatId'],
  }),
  {
    id: 'selectedChatId',
    closeOut: CloseMode.NEVER,
  }
);

export const selectedChat = sync({
  src: {
    chatsLoaded: chatsLoaded.transform(filter(Boolean)),
    selectedChatId,
    chats,
  }
}).transform(
  map(({ selectedChatId, chats }) => {
    if (!selectedChatId) {
      return null;
    }

    return chats.find(chat => chat.id === Number(selectedChatId));
  }),
  dedupe(),
  {
    id: 'selectedChat',
    closeOut: CloseMode.NEVER,
  }
);

window.addEventListener('hashchange', function() {
  setSelectedChatId(location.hash.slice(1));
});

const setSelectedChatId = (id: string) => DB.resetIn(['selectedChatId'], id);
