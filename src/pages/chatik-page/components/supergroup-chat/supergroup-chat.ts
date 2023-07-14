import { $klist } from '@thi.ng/rdom';
import { groupedMessages } from '../../../../state';
import { boxL, stackL } from '../../../../components';
import { bubble } from '../../../../components/bubble/bubble';
import { message as messageC } from '../message/message';
import { day } from '../day/day';

export const superGroupChat = () => {
  return $klist(
    groupedMessages,
    'days-l',
    { space: '1.5rem', reverse: true, role: 'list' },
    (groupedByDay) => (
      stackL(
        { space: '1.5rem', reverse: true },
        ...groupedByDay.map(groupedBySender => {

          return stackL(
            { space: '0.4rem', reverse: true },
            ...groupedBySender.map((groupedByAlbum) => {
              if (groupedByAlbum.length > 1) {
                return bubble({}, boxL({ borderWidth: '0' }, 'Album content'));
              }

              const [ message ] = groupedByAlbum;

              return stackL(
                { reverse: true },
                bubble({}, messageC(message))
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
