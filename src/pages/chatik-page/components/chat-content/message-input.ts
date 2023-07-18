import { button } from '@thi.ng/hiccup-html';
import { $inputTrigger } from '@thi.ng/rdom';
import { reactive, stream } from '@thi.ng/rstream';

import { sendMessage } from '../../../../state';
import { autogrowTextArea, bubble, sideBarL } from '../../../../components';

import './message-input.css';

export const messageInput = () => {
  const clicks = stream();
  const message = reactive('');

  clicks.subscribe({
    next: () => {
      sendMessage(message.deref()!);
      message.next('');
    },
  });

  return sideBarL(
    { side: 'right', noStretch: true, class: 'message-input-sidebar' },
    bubble(
      {},
      autogrowTextArea({ name: 'message-input', autocomplete: 'off', class: 'message-input' }, message)
    ),
    button({ onclick: $inputTrigger(clicks) }, 'Send')
  );
};
