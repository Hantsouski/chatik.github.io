import { $klist } from '@thi.ng/rdom';
import { chats } from '../../../../state/chats';
import { chat } from './chat';

import './chat-list.css';

export const chatList = $klist(
  // reactive data source (any rstream subscribable)
  chats,
  // outer list element & attribs
  'div.chat-list',
  { min: '36ch', role: 'list' },
  // list item component constructor
  (x) => chat(x),
  // key function (includes)
  x => `${x.id}-${x.title}-${x.photo?.small.id}-${x.last_message.id}`
);
