import { h4, anchor, div } from '@thi.ng/hiccup-html';
import { boxL, sideBarL, stackL, circle } from '../../../../components';
import { Chat } from '../../../../state';

import './chat.css';

export const chat = (chat: Chat) => (
  anchor(
    { class: 'chat', href: `./#${chat.id}` },
    boxL(
      {},
      sideBarL(
        { noStretch: true },
        div({}, circle(chat.title)),
        stackL(
          {},
          h4({}, chat.title),
        )
      )
    ),
  )
);
