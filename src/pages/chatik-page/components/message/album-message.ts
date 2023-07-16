import { comp, filter, iterator, map } from '@thi.ng/transducers';
import { boxL, gridL, photo } from '../../../../components';
import { Message, MessagePhoto } from '../../../../state';
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
  return photo(
    { decoding: 'async' },
    messagePhoto.photo.sizes.find((size) => size.type === 'y')?.photo || messagePhoto.photo.sizes.find((size) => size.type === 'm')!.photo
  );
};

const description = (message?: Message) => {
  if (!message) {
    return '';
  }

  return boxL({ borderWidth: '0', class: 'message' }, formattedText((message.content as MessagePhoto).caption));
};
