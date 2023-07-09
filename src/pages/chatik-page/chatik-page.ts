import { div, h2 } from '@thi.ng/hiccup-html';
import { distinct, filter, map } from '@thi.ng/transducers';
import { Component, NumOrElement } from '@thi.ng/rdom';
import { metaStream, reactive, sync } from '@thi.ng/rstream';

import { chatList } from './components';
import { sideBarL } from '../../components';
import { chatsLoaded } from '../../state/chats';
import { resizeObserver } from '../../common';

import './chatik-page.css';

const currentHash = reactive(location.hash || '');

class ChatikPage extends Component {
  async mount(parent: Element, index?: NumOrElement): Promise<Element> {
    /*
    I don't unsubscribe from 'hashchange' since ChatikPage is the main component
    which lives throught all app lifecycle, except when you need to relogin
    */
    window.addEventListener('hashchange', function() {
      currentHash.next(location.hash);
    });

    /*
      <div id="messages-container">
        <div id="messages-interior">
          <message-list />
        </div>
      </div>

      This was laid down in that structure in order to support a responsive layout
      that I wanted to try.
    */
    const messageList =
      div(
        { id: 'messages-container', class: 'messages-container' },
        div(
          {
            id: 'messages-interior',
            class: 'messages-interior',
            style: this.messagesInteriorStyles,
          },
          h2({},  'Messages'),
        ),
      );

    this.el = await this.$tree(
      this.$compile(
        sideBarL(
          {
            sideWidth: '27rem',
            contentMin: '50%',
            class: 'page-container'
          },
          div(
            {
              id: 'chatlist-container',
              class: 'chatlist-container',
              style: this.chatlistContainerStyles,
            },
            chatList,
          ),
          messageList,
        ),
      ),
      parent,
      index,
    );

    return this.el!;
  }

  private get streamToRecalculateStyles() {
    return (
      chatsLoaded
        .transform(filter(Boolean))
        .transform(distinct())
        .map(() => [
          document.querySelector('#messages-container')!,
          document.querySelector('#messages-interior')!,
          document.querySelector('#chatlist-container')!,
        ])
        .subscribe(metaStream(([messagesContainer, messagesInterior, chatList]) => (
          sync({
            src: {
              entries: resizeObserver(messagesContainer),
              hash: currentHash,
              elements: reactive([messagesContainer, messagesInterior, chatList]),
            }
          })
        )))
      );
  }

  private get messagesInteriorStyles() {
    return this.streamToRecalculateStyles
      .transform(
        map(({ entries, hash, elements }) => {
          const [ messagesContainer, messagesInterior, chatlistContainer ] = elements;

          const entry = entries[0];

          if (entry.borderBoxSize[0].inlineSize !== document.body.clientWidth) {
            return '';
          }

          const { width } = messagesInterior.getBoundingClientRect();
          const { width: chatlistWidth } = chatlistContainer.getBoundingClientRect();
          const { top } = messagesContainer.getBoundingClientRect();

          if (!hash && chatlistWidth === document.body.clientWidth) {
            return `position: absolute; top: ${-top}px; right: -${width}px; transform: translateX(0);`;
          }

          if (chatlistWidth === document.body.clientWidth) {
            return `position: absolute; top: ${-top}px; right: -${width}px; transform: translateX(${-chatlistWidth}px);`;
          }

          return '';
        })
      );
  }

  private get chatlistContainerStyles() {
    return this.streamToRecalculateStyles
      .transform(
        map(({ hash, elements }) => {
          const [,,chatlistContainer] = elements;
          const { width } = chatlistContainer.getBoundingClientRect();

          if (!hash && width === document.body.clientWidth) {
            return `transform: translateX(0);`
          }

          if (width === document.body.clientWidth) {
            return `transform: translateX(${-width}px);`
          }

          return '';
        })
      );
  }
}
export const chatikPage = () => new ChatikPage();
