import { CloseMode, fromView, metaStream, syncRAF } from '@thi.ng/rstream';
import { comp, filter, map, partitionBy, sideEffect, trace } from '@thi.ng/transducers';
import { DB, selectedChatId, isAuthorized, Message, isUserSender } from '.';
import telegram from '../data-access/telegram/telegram';
import { uuid } from '../common';

const telegramMessages = telegram.messages();

selectedChatId.transform(sideEffect(() => clearMessages()));

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

    const restMessages = await telegramMessages.get({
      chat_id: selectedChatId,
      from_message_id: lastMessage.id,
    });

    addMessages([lastMessage, ...restMessages]);
}}));

const partitionByDay = (messages: Message[]) => {
  return [
    ...partitionBy(message => {
        const date = new Date(message.date * 1000);

        return `${date.getFullYear()}:${date.getMonth()}:${date.getDate()}`;
    }, messages)
  ];
};

const partitionBySender = (messages: Message[]) => {
  return [
    ...partitionBy(message => {
      return isUserSender(message.sender_id) ? message.sender_id.user_id : message.sender_id.chat_id;
    }, messages)
  ];
};

const partitionByPhotoAlbum = (messages: Message[]) => {
  return [
    ...partitionBy(message => {
        return message.media_album_id !== '0' && !!message.media_album_id
          ? message.media_album_id
          : uuid();
    }, messages)
  ];
};

export const groupedMessages = messages.transform(
  comp(
    filter(messages => !!messages.length),
    map(partitionByDay),
    map((days) => days.map(day => partitionBySender(day).map(partitionByPhotoAlbum))),
  )
);

export const fetchMore = async () => {
  const messagesDerefed = messages.deref()!;
  const chatId = selectedChatId.deref()!;

  const lastMessage = messagesDerefed[messagesDerefed.length - 1];

  const newMessages = await telegramMessages.get({
    chat_id: chatId,
    from_message_id: lastMessage.id,
  });

  addMessages(messagesDerefed.concat(newMessages));
};

const clearMessages = () => {
  DB.resetIn(['messages'], []);
};
