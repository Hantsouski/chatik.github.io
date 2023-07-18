import { h4, header, span } from '@thi.ng/hiccup-html';
import { avatarCircle, boxL, photo, sideBarL, stackL } from '../../../../components';
import { selectedChatTitleAndPhoto } from '../../../../state';
import { $replace } from '@thi.ng/rdom';

export const chatHeader = () => {
  const el = selectedChatTitleAndPhoto.map(([title, chatPhoto]) => {
    return header(
      { class: 'chat-header' },
      boxL(
        { borderWidth: '0', padding: '0.5em var(--size-step-1)' },
        sideBarL(
          {},
          chatPhoto?.small
            ? photo({ class: 'avatar', decoding: 'async', width: 54, height: 54 }, chatPhoto.small, avatarCircle(title))
            : avatarCircle(title),
          stackL({ space: '0.3rem' }, h4({}, title))
        )
      )
    );
  });

  return $replace(el);
};
