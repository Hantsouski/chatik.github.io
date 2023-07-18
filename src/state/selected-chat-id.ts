import { CloseMode, fromView, sync, syncRAF } from '@thi.ng/rstream';
import { DB, chats, Chat } from '.';
import { comp, dedupe, filter, map } from '@thi.ng/transducers';

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
    selectedChatId,
    chats,
  }
}).transform(
  comp(
    filter(({ selectedChatId }) => !!selectedChatId),
    map(({ selectedChatId, chats }) => (
      chats.find(chat => chat.id === Number(selectedChatId))
    )),
    filter(chat => !!chat),
  ),
  {
    id: 'selectedChat',
    closeOut: CloseMode.NEVER,
  },
);

export const canSendMessages = selectedChat.transform(map(chat => chat?.permissions.can_send_messages), dedupe());

export const selectedChatType = selectedChat.transform(
  comp(
    map(chat => chat!.type['@type']),
    dedupe(),
  ),
);

export const selectedChatTitleAndPhoto = selectedChat.transform(
  comp(
    map(chat => [chat?.title, chat?.photo] as [string, Chat['photo']]),
    dedupe(([, photoA], [, photoB]) => photoA?.small.id === photoB?.small.id),
  ),
);

window.addEventListener('hashchange', function() {
  setSelectedChatId(location.hash.slice(1));
});

const setSelectedChatId = (id: string) => DB.resetIn(['selectedChatId'], id);
