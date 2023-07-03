import { Message } from '../state';

export const messageTime = (message: Message): string => {
  return (new Date(message.date * 1000)).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
