import { $klist } from '@thi.ng/rdom';
import { div, h4 } from '@thi.ng/hiccup-html';
import { getUser, groupedMessages, isMe, isPhotoContent } from '../../../../state';
import { stackL, bubble, photo, circle, } from '../../../../components';
import { message as messageC } from '../message/message';
import { day } from '../day/day';
import { albumMessage } from '../message/album-message';
import { abbreviatedName } from '../../../../common';

import './basicgroup-chat.css';

export const basicGroupChat = () => {
  return $klist(
    groupedMessages,
    'days-l.fade-in',
    { space: '1.5rem', reverse: true, role: 'list' },
    (groupedByDay) => (
      stackL(
        { space: '1.5rem', reverse: true },
        ...groupedByDay.map(groupedBySender => {
          const me = isMe('user_id' in groupedBySender[0][0].sender_id
              ? groupedBySender[0][0].sender_id.user_id
              : groupedBySender[0][0].sender_id.chat_id);

          const align = me ? 'flex-end': '';

          const user = getUser((groupedBySender[0][0].sender_id as any).user_id);

          const avatarCircle = circle({ body: abbreviatedName(user.first_name), width: '40px', height: '40px', color: 'orange' });

          const authorPhoto = !me ? (
            div(
              { class: 'author-photo-container' },
              div(
                { class: 'author-photo' },
                user.profile_photo
                  ? photo(
                      { class: 'avatar', decoding: 'async', width: 40, height: 40 },
                      user.profile_photo.small,
                      avatarCircle
                    )
                  : avatarCircle
              ),
            )
          ) : null;

          return div(
            { class: 'message-group' },
            stackL(
              { space: '0.4rem', reverse: true, align },
              ...groupedBySender.map((groupedByAlbum, index) => {
                if (groupedByAlbum.length > 1) {
                  return bubble({}, albumMessage(groupedByAlbum));
                }

                const [ message ] = groupedByAlbum;

                const straightCorner = index === 0 && !isPhotoContent(message.content)
                  ? me ? 'right' : 'left'
                  : undefined;

                const title = index === groupedBySender.length - 1 && !me
                  ? h4({}, 'user_id' in message.sender_id ? getUser(message.sender_id.user_id).first_name : 'Channel')
                  : undefined;

                return stackL(
                  { align },
                  bubble({ straightCorner }, messageC(message, { title }))
                );
              }),
            ),
            authorPhoto,
          )
        }),
        day(groupedByDay[0][0][0].date),
      )
    ),
    days => days.flatMap(senders => senders.map(messages => messages[0].id)).join(''),
  );
};
