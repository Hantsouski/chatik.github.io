import { para } from '@thi.ng/hiccup-html';
import { Message, MessagePhoto, MessageText, isPhotoContent, isTextContent } from '../../../../state';
import { boxL, photo } from '../../../../components';

import './message.css';

interface MessageOpts {
  title: any[];
}

export const message = (message: Message, opts?: Partial<MessageOpts>) => {
  return boxL({ borderWidth: '0', class: 'message' }, ...messageBody(message, opts));
};

const messageBody = (message: Message, opts?: Partial<MessageOpts>) => {
  const title = opts?.title || null;

  if (isTextContent(message.content)) {
    return [title, text(message.content)];
  }

  if (isPhotoContent(message.content)) {
    return [photoContent(message.content)];
  }

  return [title, para({}, 'Unsupported content')];
}

const text = (messageText: MessageText) => para({}, messageText.text.text);

const photoContent = (messagePhoto: MessagePhoto) => {
  return photo(
    { decoding: 'async' },
    messagePhoto.photo.sizes.find(size => size.type === 'x')!.photo,
  )
};
