import { filter } from '@thi.ng/transducers';
import { div, h4, header, span } from '@thi.ng/hiccup-html';
import { $replace } from '@thi.ng/rdom';
import { defmulti } from '@thi.ng/defmulti';

import './chat-content.css';

import { avatarCircle, boxL, centerL, photo, sideBarL, stackL } from '../../../../components';
import { Chat, fetchMore, selectedChat } from '../../../../state';
import { privateChat } from '../private-chat/private-chat';
import { superGroupChat } from '../supergroup-chat/supergroup-chat';
import { basicGroupChat } from '../basicgroup-chat/basicgroup-chat';


const messages = selectedChat.map(chat => chat
    ? div(
        { class: 'chat-content-container' },
        header(
          { class: 'chat-header' },
          boxL(
            { borderWidth: '0', padding: '0.5em var(--size-step-1)' },
            sideBarL(
              {},
              chat?.photo?.small
                ? photo(
                    { class: 'avatar', decoding: 'async', width: 54, height: 54 },
                    chat.photo.small,
                    avatarCircle(chat.title),
                  )
                : avatarCircle(chat.title),
              stackL(
                { space: '0.3rem'},
                h4({}, chat.title),
                span({}, chat.member_count),
              ),
            )
          ),
        ),
        boxL(
          { class: 'chat-content', borderWidth: '0' },
          centerL(
            { max: '60ch', class: 'messages-list-container' },
            div({}, div({ id: 'scrolled-to-top' }), messagesList(chat)),
          )),
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
    const top = document.getElementById('scrolled-to-top')!;

    const topObserver = new IntersectionObserver(reachingTopCallback, { root: null, rootMargin: '250px' });

    topObserver.observe(top);
  });
}}));

export const chatContent = $replace(messages);
