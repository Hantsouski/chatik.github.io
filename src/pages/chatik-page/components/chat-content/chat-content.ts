import { defmulti } from '@thi.ng/defmulti';

import { Chat, selectedChat } from '../../../../state';

import './chat-content.css';
import { $replace } from '@thi.ng/rdom';
import { centerL } from '../../../../components';
import { privateChat } from '../private-chat/private-chat';
import { superGroupChat } from '../supergroup-chat/supergroup-chat';
import { basicGroupChat } from '../basicgroup-chat/basicgroup-chat';

const messages = selectedChat.map(chat => chat
    ? centerL({ max: '60ch', andText: true }, messagesList(chat))
    : null
);

const messagesList = defmulti((chat: Chat) => chat.type['@type'], {}, {
  'chatTypePrivate': () => privateChat,
  'chatTypeSupergroup': () => superGroupChat,
  'chatTypeBasicGroup': () => basicGroupChat,
});

export const chatContent = $replace(messages);
