import { comp, filter, iterator, map } from '@thi.ng/transducers';
import { boxL, frameL, gridL, photo } from '../../../../components';
import { Message, MessagePhoto, messagePhotoSize } from '../../../../state';
import { formattedText } from './message';
import { div } from '@thi.ng/hiccup-html';

export const albumMessage = (messages: Message[]) => {
  return div(
    {},
    gridL(
      { space: 'calc(var(--size-step-0) / 2.5)' },
      ...iterator(
        comp(
          filter((message) => message.content['@type'] === 'messagePhoto'),
          map((message) => photoContent(message.content as MessagePhoto))
        ),
        messages
      ),
    ),
    description(messages.find((message) => (message.content as MessagePhoto).caption.text)),
  );
};

const photoContent = (messagePhoto: MessagePhoto) => {
  const photoSize = messagePhotoSize(messagePhoto.photo.sizes);

  if (!photoSize) {
    return div(
      {},
    );
  }

  const ratio = `${Math.ceil((photoSize.width / photoSize.height) * 2)}:2`;

  return frameL(
    { ratio },
    photo(
      { decoding: 'async', width: photoSize.width, height: photoSize.height },
      photoSize.photo
    ));
};

const description = (message?: Message) => {
  if (!message) {
    return '';
  }

  return boxL({ borderWidth: '0', class: 'message' }, formattedText((message.content as MessagePhoto).caption));
};
