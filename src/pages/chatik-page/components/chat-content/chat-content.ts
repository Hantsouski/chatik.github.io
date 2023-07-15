import { filter } from '@thi.ng/transducers';
import { div } from '@thi.ng/hiccup-html';
import { $replace } from '@thi.ng/rdom';
import { defmulti } from '@thi.ng/defmulti';

import './chat-content.css';

import { boxL, centerL } from '../../../../components';
import { Chat, fetchMore, selectedChat } from '../../../../state';
import { privateChat } from '../private-chat/private-chat';
import { superGroupChat } from '../supergroup-chat/supergroup-chat';
import { basicGroupChat } from '../basicgroup-chat/basicgroup-chat';

const messages = selectedChat.map(chat => chat
    ? boxL(
        { class: 'chat-content-container', borderWidth: '0' },
        centerL(
          { max: '60ch', class: 'chat-content' },
          messagesList(chat),
        ),
        div({ id: 'top' }),
      )
    : null
);

const messagesList = defmulti((chat: Chat) => chat.type['@type'], {}, {
  'chatTypePrivate': () => privateChat(),
  'chatTypeSupergroup': () => superGroupChat(),
  'chatTypeBasicGroup': () => basicGroupChat(),
});

const reachingTopCallback = (entries: any) => {
  const [ entry ] = entries;

  if (entry.isIntersecting) {
    fetchMore();
  }
}

messages.transform(filter(Boolean)).subscribe(({ next: () => {
  requestAnimationFrame(() => {
    const top = document.getElementById('top')!;
    const root = document.querySelector('.chat-content-container')!;

    const observer = new IntersectionObserver(reachingTopCallback, { root, rootMargin: '1500px' });

    observer.observe(top);
  });
}}));

export const chatContent = $replace(messages);
