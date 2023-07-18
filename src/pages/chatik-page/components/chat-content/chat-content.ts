import { div } from '@thi.ng/hiccup-html';
import { $replace, Component, NumOrElement } from '@thi.ng/rdom';

import './chat-content.css';

import { boxL, centerL } from '../../../../components';
import { canSendMessages, fetchMore, selectedChatId, selectedChatType } from '../../../../state';
import { privateChat } from '../private-chat/private-chat';
import { superGroupChat } from '../supergroup-chat/supergroup-chat';
import { basicGroupChat } from '../basicgroup-chat/basicgroup-chat';
import { messageInput } from './message-input';
import { chatHeader } from './chat-header';

export const chatContent = $replace(
  selectedChatId.map((chatId) => {
    if (!chatId) {
      return div({ class: 'chat-content-container' });
    }

    return div(
      { class: 'chat-content-container fade-in' },
      chatHeader(),
      new Messages(),
      div(
        { class: 'send-message-container' },
        $replace(canSendMessages.map((allowed) => (allowed ? boxL({ borderWidth: '0' }, centerL({ max: '60ch' }, messageInput())) : null)))
      )
    );
  })
);

class Messages extends Component {
  private topElObserver: IntersectionObserver | undefined;

  async mount(parent: Element, index?: NumOrElement): Promise<Element> {
    this.el = await this.$tree(
      this.$compile(
        boxL(
          { class: 'chat-content', borderWidth: '0' },
          centerL(
            { max: '60ch', class: 'messages-list-center-container' },
            div({ class: 'messages-list-container' }, div({ id: 'scrolled-to-top' }), messagesList())
          )
        )
      ),
      parent,
      index
    );

    setTimeout(() => this.setObserver(), 1000);

    return this.el!;
  }

  private setObserver() {
    const topEl = document.getElementById('scrolled-to-top')!;

    if (!topEl) {
      return;
    }

    this.topElObserver = new IntersectionObserver(this.reachingTopCallback, { root: null, rootMargin: '250px' });

    this.topElObserver.observe(topEl);
  }

  private reachingTopCallback(entries: any) {
    const [entry] = entries;

    if (entry.isIntersecting) {
      fetchMore();
    }
  }
}

const messagesList = () => {
  const listTypes = new Map([
    ['chatTypePrivate', privateChat],
    ['chatTypeSupergroup', superGroupChat],
    ['chatTypeBasicGroup', basicGroupChat],
  ]);

  return $replace(selectedChatType.map((type) => listTypes.get(type)!()));
};
