import { h4, anchor, div, span } from '@thi.ng/hiccup-html';
import { boxL, sideBarL, stackL, circle, photo, avatarCircle } from '../../../../components';
import { Chat, getUser, isBasicGroup, isPhotoContent, isTextContent, selectedChatId } from '../../../../state';
import { croppedText, messageTime } from '../../../../common';

import './chat.css';

export const chat = (chat: Chat) => (
  anchor(
    { class: 'chat fade-in', active: selectedChatId.map(id => id === `${chat.id}`), href: `./#${chat.id}` },
    boxL(
      { borderWidth: '0' },
      sideBarL(
        {},
        div(
          { class: 'avatar-container' },
          chat.photo
            ? photo(
                { class: 'avatar', decoding: 'async', width: 54, height: 54 },
                chat.photo.small,
                avatarCircle(chat.title),
              )
            : avatarCircle(chat.title),
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
      ? `${getUser('user_id' in message.sender_id ? message.sender_id.user_id : 0).first_name}: ${croppedText(message.content.text)}`
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

  return circle({ body: `${chat.unread_count}`, width: '30px', height: '30px', color: 'var(--accent-ui)' });
}
