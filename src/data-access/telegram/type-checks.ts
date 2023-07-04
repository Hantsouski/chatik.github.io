import { Chat, ChatTypeBasicGroup, ChatUpdates, Message, MessagePhoto, MessageText } from './api';

export const isBasicGroup = (chatType: Chat['type']): chatType is ChatTypeBasicGroup => {
  return chatType['@type'] === 'chatTypeBasicGroup';
}

export const isTextContent = (content: Message['content']): content is MessageText => {
  return content['@type'] === 'messageText';
};

export const isPhotoContent = (content: Message['content']): content is MessagePhoto => {
  return content['@type'] === 'messagePhoto';
};

export const isChatUpdates = (updateType: string): updateType is ChatUpdates => {
  return (
    updateType === 'updateChatLastMessage' ||
    updateType === 'updateChatPosition' ||
    updateType === 'updateChatReadInbox'
  );
}
