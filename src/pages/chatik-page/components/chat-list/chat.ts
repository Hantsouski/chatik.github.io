import { h4, anchor, div, span } from '@thi.ng/hiccup-html';
import { boxL, sideBarL, stackL, circle } from '../../../../components';
import { Chat, isBasicGroup, isPhotoContent, isTextContent } from '../../../../state';
import { abbreviatedName, croppedText, messageTime } from '../../../../common';

import './chat.css';

export const chat = (chat: Chat) => (
  anchor(
    { class: 'chat', href: `./#${chat.id}` },
    boxL(
      {},
      sideBarL(
        {},
        div(
          { class: 'avatar-container' },
          circle({ name: abbreviatedName(chat.title), width: '54px', height: '54px', color: 'orange' }),
        ),
        stackL(
          {},
          sideBarL(
            { side: 'right' },
            h4({}, chat.title),
            messageTime(chat.last_message),
          ),
          sideBarL(
            { side: 'right' },
            span(
              { class: 'chat-last-message'},
              lastMessage(chat),
            ),
            unreadCount(chat),
          ),
        ),
      ),
    ),
  )
);

const lastMessage = (chat: Chat) => {
  const message = chat.last_message;

  if (isTextContent(message.content)) {
    return isBasicGroup(chat.type)
      ? `Username: ${croppedText(message.content.text)}`
      : croppedText(message.content.text);
  }

  if (isPhotoContent(message.content)) {
    return message.media_album_id !== '0'
      ? 'Album'
      : (message.content.caption.text && croppedText(message.content.caption)) || 'Photo'
  }

  return 'Unsupported';
};

const unreadCount = (chat: Chat) => {
  if (!chat.unread_count) {
    return null;
  }

  return circle({ name: `${chat.unread_count}`, width: '30px', height: '30px', color: 'var(--accent-ui)' });
}
