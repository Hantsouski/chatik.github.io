import { $klist } from '@thi.ng/rdom';
import { h4 } from '@thi.ng/hiccup-html';
import { getUser, groupedMessages, isMe, isPhotoContent } from '../../../../state';
import { stackL, bubble, } from '../../../../components';
import { message as messageC } from '../message/message';
import { day } from '../day/day';
import { albumMessage } from '../message/album-message';

export const basicGroupChat = () => {
  return $klist(
    groupedMessages,
    'days-l',
    { space: '1.5rem', reverse: true, role: 'list' },
    (groupedByDay) => (
      stackL(
        { space: '1.5rem', reverse: true },
        ...groupedByDay.map(groupedBySender => {
          const me = isMe('user_id' in groupedBySender[0][0].sender_id
              ? groupedBySender[0][0].sender_id.user_id
              : groupedBySender[0][0].sender_id.chat_id);

          const align = me ? 'flex-end': '';

          return stackL(
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
                { reverse: true, align },
                bubble({ straightCorner }, messageC(message, { title }))
              );
            }),
          )
        }),
        day(groupedByDay[0][0][0].date),
      )
    ),
    days => days.flatMap(senders => senders.map(messages => messages[0].id)).join(''),
  );
};
