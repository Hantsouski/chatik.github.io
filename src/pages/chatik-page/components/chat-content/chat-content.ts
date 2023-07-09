import { h2 } from '@thi.ng/hiccup-html';
import { defmulti } from '@thi.ng/defmulti';

import { Chat, selectedChat } from '../../../../state';

import './chat-content.css';
import { $replace } from '@thi.ng/rdom';
import { centerL } from '../../../../components';

const messages = selectedChat.map(chat => chat
    ? centerL({ max: '60ch', andText: true }, messagesList(chat))
    : null
);

const messagesList = defmulti((chat: Chat) => chat.type['@type'], {}, {
  'chatTypePrivate': () => h2({}, 'Private chat'),
  'chatTypeSupergroup': () => h2({}, 'Supergroup chat'),
  'chatTypeBasicGroup': () =>  h2({}, 'Basicgroup chat'),
});

export const chatContent = $replace(messages);
