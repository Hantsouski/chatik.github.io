import { CloseMode, fromView, metaStream, syncRAF } from '@thi.ng/rstream';
import { comp, filter, map, partitionBy, sideEffect } from '@thi.ng/transducers';
import { DB, selectedChatId, isAuthorized, Message, isUserSender, FormattedText, PhotoSize } from '.';
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

const addMessages = (messages: Message[]) => DB.resetIn(['messages'], messages);

isAuthorized
  .transform(filter(Boolean))
  .subscribe(metaStream(() => selectedChatId.transform(filter(id => !!id))))
  .subscribe(({ next: async (selectedChatId) => {
    const [ lastMessage ] = await telegramMessages.get({
      chat_id: selectedChatId,
      limit: 50,
    });

    const restMessages = await telegramMessages.get({
      chat_id: selectedChatId,
      from_message_id: lastMessage.id,
      limit: 50,
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

export const fetchMore = async (limit = 50) => {
  const messagesDerefed = messages.deref()!;
  const chatId = selectedChatId.deref()!;

  const lastMessage = messagesDerefed[messagesDerefed.length - 1];

  const newMessages = await telegramMessages.get({
    chat_id: chatId,
    from_message_id: lastMessage.id,
    limit,
  });

  addMessages(messagesDerefed.concat(newMessages));
};

export const sendMessage = async (text: string) => {
  const formattedText = {
    '@type': 'formattedText',
    text,
    entities: []
  } as FormattedText;

  await telegramMessages.send({
    chat_id: selectedChatId.deref()!,
    formatted_text: formattedText,
  });
};

telegramMessages.updates.on('updateNewMessage', update => {
  if (selectedChatId.deref()! !== `${(update.message as any as Message).chat_id}`) {
    return;
  }

  const messagesDerefed = messages.deref()!;

  addMessages([update.message as any as Message].concat(messagesDerefed));
});

const clearMessages = () => {
  DB.resetIn(['messages'], []);
};

export const messagePhotoSize = (sizes: PhotoSize[], dimension = 600) => {
  if (!sizes || !sizes.length) {
    return null;
  }

  const iSize = sizes.find(size => size.type === 'i');
  if (iSize) {
    return iSize;
  }

  const useWidth = sizes[0].width >= sizes[0].height;
  const diff = Math.abs(dimension - (useWidth ? sizes[0].width : sizes[0].height));

  let index = 0;
  for (const [currentIndex] of sizes.entries()) {
    const nextIndex = currentIndex + 1;

    if (!sizes[nextIndex]) {
      break;
    }

    if (sizes[nextIndex].type === 'i' && !sizes[nextIndex].photo.local.is_downloading_completed) {
      continue;
    }

    let currDiff = Math.abs(dimension - (useWidth ? sizes[nextIndex].width : sizes[nextIndex].height));
    if (currDiff < diff) {
      index = nextIndex;
      currDiff = diff;
    }
  }

  return sizes[index];
};
