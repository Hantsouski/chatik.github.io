import { Chat, ChatTypeBasicGroup, ChatUpdates, Message, MessagePhoto, MessageSenderUser, MessageText, MessagesUpdates, UserUpdates } from './api';

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
    updateType === 'updateChatReadInbox' ||
    updateType === 'updateBasicGroup' ||
    updateType === 'updateSupergroupFullInfo'
  );
};

export const isMessagesUpdates = (updateType: string): updateType is MessagesUpdates => {
  return (
    updateType === 'updateMessageInteractionInfo' ||
    updateType === 'updateNewMessage'
  );
};

export const isUserUpdates = (updateType: string): updateType is UserUpdates => {
  return updateType === 'updateUser';
};

export const isUserSender = (sender: Message['sender_id']): sender is MessageSenderUser => {
  return 'user_id' in sender;
};
